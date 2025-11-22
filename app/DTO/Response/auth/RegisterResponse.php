<?php

namespace App\DTO\Response\Auth;

class RegisterResponse
{
  public ?string $id;
  public ?string $email;
  public ?string $name;
  public ?string $token;
}