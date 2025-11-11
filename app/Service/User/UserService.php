<?php



namespace App\Service\User;

use App\DTO\Request\User\UserStoreAttributeRequest;
use App\DTO\Request\User\UserUpdateAttributeRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService
{

  public function index($whoAmI, $filters)
  {

    $role = $filters['filter_list']['select_filter']['role'];

    $query = User::with('role')
      ->whereNot('id', $whoAmI->id)
      ->when($whoAmI->role->slug == 'super_admin', function ($query) {
        $query->whereHas('role', function ($q) {
          $q->whereNot('slug', 'super_admin');
        });
      })
      ->when($whoAmI->role->slug == 'admin', function ($query) {
        $query->whereHas('role', function ($q) {
          $q->whereNotIn('role', ['super_admin', 'admin']);
        });
      })
      ->when($whoAmI->role->slug == 'midwife', function ($query) {
        $query->whereHas('role', function ($q) {
          $q->whereNotIn('role', ['super_admin', 'admin', 'midwife']);
        });
      })
      ->when($role, function ($query, $filter) {
        $query->whereHas('role', function ($q) use ($filter) {
          $q->where('id', $filter);
        });
      })
      ->when($filters['search'], function ($query, $search) {
        $query->where(function ($q) use ($search) {
          $searchTerms = '%' . $search . '%';
          $q->where('name', 'like', $searchTerms);
        });
      })
      ->when($filters['only_trash'], function ($q) {
        $q->onlyTrashed();
      })
      ->latest();


    return $query->paginate(10)
      ->withQueryString();
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

  public function softDelete(string $id)
  {
    return DB::transaction(function () use ($id) {
      $user = User::findOrFail($id);

      $user->delete();

      return $user;
    });
  }
}
