<?php

namespace App\DTO\Response\Auth;

class LoginResponse
{
  public ?string $id = null;
  public ?string $email = null;
  public ?string $name = null;
  public ?string $token = null;
  public ?string $role = null;
}