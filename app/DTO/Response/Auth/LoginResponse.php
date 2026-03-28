<?php

namespace App\DTO\Response\Auth;

class LoginResponse
{
  public ?string $id;
  public ?string $email;
  public ?string $name;
  public ?string $token;
  public ?string $role;
}