<?php



namespace App\Service\User;

use App\DTO\Request\User\UserStoreAttributeRequest;
use App\DTO\Request\User\UserUpdateAttributeRequest;
use App\DTO\Request\User\UserUpdatePasswordRequest;
use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService
{

  public function index($whoAmI, $filters)
  {
    $role = $filters['filter_list']['select_filter']['role'];
    $search = $filters['search'];
    $onlyTrash = $filters['only_trash'];

    $query = User::with('role')
      ->where('id', '!=', $whoAmI->id)
      ->when($whoAmI->role->slug === 'super_admin', function ($q) {
        $q->whereHas('role', fn($r) => $r->where('slug', '!=', 'super_admin'));
      })
      ->when($whoAmI->role->slug === 'admin', function ($q) {
        $q->whereHas('role', fn($r) => $r->whereNotIn('slug', ['super_admin', 'admin']));
      })
      ->when($whoAmI->role->slug === 'midwife', function ($q) {
        $q->whereHas('role', fn($r) => $r->whereNotIn('slug', ['super_admin', 'admin']));
      })
      ->when($role, function ($q, $role) {
        $q->whereHas('role', fn($r) => $r->where('slug', $role));
      })
      ->when($search, function ($q, $search) {
        $q->where('name', 'like', "%{$search}%");
      })
      ->when($onlyTrash, fn($q) => $q->onlyTrashed())
      ->latest();

    return $query->paginate(10)->withQueryString();
  }


  public function store(UserStoreAttributeRequest $request)
  {
    $user = DB::transaction((function () use ($request) {
      return User::create([
        'name' => $request->name,
        'email' => $request->email,
        'role_id' => $request->role_id,
        'password' => Hash::make($request->password),
        'email_verified_at' => now(),
        'is_verified' => true,
        'province_id' => $request->province_id,
        'city_or_district_id' => $request->regency_id,
        'subdistrict_id' => $request->district_id,
        'village_id' => $request->village_id,
        'number_patient' => $this->generatePatientNumber(),
        'province' => $request->province,
        'city_or_district' => $request->regency,
        'subdistrict' => $request->district,
        'village' => $request->village
      ]);
    }));

  }

  public function update(UserUpdateAttributeRequest $request, string $id)
  {
    return DB::transaction(function () use ($request, $id) {
      $user = User::findOrFail($id);
      $newRole = \App\Models\Role::find($request->role_id);

      $updateData = [
        'name' => $request->name,
        'role_id' => $request->role_id,
      ];

      // Only update location data if the new role is midwife
      // For patient role, we keep existing location data (don't clear it)
      if ($newRole && $newRole->slug === 'midwife') {
        // Update with form data for midwife, or keep existing if not provided
        if ($request->province_id !== null) {
          $updateData['province_id'] = $request->province_id;
        } elseif ($user->province_id) {
          // Keep existing if not provided
          $updateData['province_id'] = $user->province_id;
        }

        if ($request->regency_id !== null) {
          $updateData['city_or_district_id'] = $request->regency_id;
        } elseif ($user->city_or_district_id) {
          // Keep existing if not provided
          $updateData['city_or_district_id'] = $user->city_or_district_id;
        }

        if ($request->district_id !== null) {
          $updateData['subdistrict_id'] = $request->district_id;
        } elseif ($user->subdistrict_id) {
          // Keep existing if not provided
          $updateData['subdistrict_id'] = $user->subdistrict_id;
        }

        if ($request->village_id !== null) {
          $updateData['village_id'] = $request->village_id;
        } elseif ($user->village_id) {
          // Keep existing if not provided
          $updateData['village_id'] = $user->village_id;
        }

        if ($request->province !== null) {
          $updateData['province'] = $request->province;
        } elseif ($user->province) {
          // Keep existing if not provided
          $updateData['province'] = $user->province;
        }

        if ($request->city_or_district !== null) {
          $updateData['city_or_district'] = $request->city_or_district;
        } elseif ($user->city_or_district) {
          // Keep existing if not provided
          $updateData['city_or_district'] = $user->city_or_district;
        }

        if ($request->subdistrict !== null) {
          $updateData['subdistrict'] = $request->subdistrict;
        } elseif ($user->subdistrict) {
          // Keep existing if not provided
          $updateData['subdistrict'] = $user->subdistrict;
        }

        if ($request->village !== null) {
          $updateData['village'] = $request->village;
        } elseif ($user->village) {
          // Keep existing if not provided
          $updateData['village'] = $user->village;
        }
      }
      // If changing to patient, keep existing location data (don't update, don't clear)
      // This preserves location history for future reference if they become midwife again

      $user->update($updateData);
    });
  }

  public function changeEmail(?string $email, ?string $id)
  {
    try {
      $findUser = User::find($id);

      if ($findUser->email == $email)
        throw new Exception('tidak bisa mengubah email yang sama', 400);

      $findUser->email = $email;
      $findUser->email_verified_at = null;


      $findUser->save();

      event(new Registered($findUser));

      return $findUser;
    } catch (Exception $error) {
      throw new Exception($error->getMessage(), $error->getCode());
    }
  }

  public function changePassword(UserUpdatePasswordRequest $request, ?string $id = null)
  {
    try {
      $user = User::find($id);

      if (!Hash::check($request->oldPassword, $user->password))
        throw new Exception('password salah', 400);

      $user->password = Hash::make($request->newPassword);

      $user->save();

      return $user;
    } catch (Exception $error) {
      throw new Exception($error->getMessage(), $error->getCode());
    }
  }

  public function softDelete(string $id)
  {
    return DB::transaction(function () use ($id) {
      $user = User::findOrFail($id);

      $user->delete();

      return $user;
    });
  }

  private static function generatePatientNumber()
  {
    $prefix = 'PS-' . date('ym') . '-';

    return DB::transaction(function () use ($prefix) {
      $lastUser = User::where('number_patient', 'like', $prefix . '%')
        ->lockForUpdate()
        ->orderBy('number_patient', 'desc')
        ->first();

      if (!$lastUser) {
        $number = 1;
      } else {
        $lastNumber = (int) substr($lastUser->patient_number, -4);
        $number = $lastNumber + 1;
      }
      return $prefix . str_pad($number, 4, '0', STR_PAD_LEFT);
    });
  }
}
