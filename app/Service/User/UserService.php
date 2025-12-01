<?php



namespace App\Service\User;

use App\DTO\Request\User\UserStoreAttributeRequest;
use App\DTO\Request\User\UserUpdateAttributeRequest;
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
        $q->whereHas('role', fn($r) => $r->whereNotIn('slug', ['super_admin', 'admin', 'midwife']));
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

    // $password = Str::random(8);

    $user = DB::transaction((function () use ($request) {
      return User::create([
        'name' => $request->name,
        'email' => $request->email,
        'role_id' => $request->role_id,
        'password' => Hash::make($request->password)
      ]);
    }));

    event(new Registered($user));
  }

  public function update(UserUpdateAttributeRequest $request, string $id)
  {
    return DB::transaction(function () use ($request, $id) {
      User::findOrFail($id)->update([
        'name' => $request->name,
        'role_id' => $request->role_id,
      ]);
    });
  }

  public function changeEmail(?string $email, ?string $id) 
  {
    try {
      $findUser = User::find($id);

      if($findUser->email == $email) throw new Exception('tidak bisa mengubah email yang sama', 400);

      $findUser->email = $email;
      $findUser->email_verified_at = null;

      
      $findUser->save();
      
      event(new Registered($findUser));
      
      return $findUser;
    }catch(Exception $error) {
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
}
