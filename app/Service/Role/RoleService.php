<?php

namespace App\Service\Role;

use App\Models\Role;

class RoleService
{

  public function getAllRoles($whoAmI)
  {

    $authUser = auth()->user();

    $roles = Role::with('permissions');

    if ($authUser->role->slug === 'super_admin') {
      return $roles->get();
    }

    if ($authUser->role->slug === 'admin') {
      return $roles
        ->whereNotIn('slug', ['super_admin', 'admin'])
        ->get();
    }

    if ($authUser->role->slug === 'midwife') {
      return $roles
        ->whereNotIn('slug', ['super_admin', 'admin', 'patient'])
        ->get();
    }
  }

  public function index()
  {

    return Role::with('permissions')->get();
  }
}
