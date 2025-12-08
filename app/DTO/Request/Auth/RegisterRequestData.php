<?php

namespace App\DTO\Request\Auth;

class RegisterRequestData
{
  public ?string $email;
  public ?string $name;
  public ?string $password;
}