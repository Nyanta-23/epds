<?php

namespace App\Service\Permission;

use App\Models\Permission;

class PermissionService
{
  public function getAllPermissions()
  {
    return Permission::all();
  }
}
