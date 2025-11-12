<?php

namespace App\DTO\Request\User;

class UserStoreAttributeRequest
{
  public string $name;
  public string $email;
  public string $password;
  public string $role_id;
}
