<?php

namespace App\DTO\Request\User;

class UserStoreAttributeRequest
{
  public string $name;
  public string $email;
  public string $password;
  public string $role_id;
  public string $province_id;
  public string $district_id;
  public string $regency_id;
  public string $village_id;
}
