<?php

namespace App\DTO\Response\Auth;

class RegisterResponse
{
  public ?string $id = null;
  public ?string $email = null;
  public ?string $name = null;
  public ?string $token = null;
}