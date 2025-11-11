<?php

namespace App\Service\Role;

use App\Models\Role;

class RoleService
{

  public function getAllRoles()
  {
    return Role::with('permissions')->get();
  }
}
