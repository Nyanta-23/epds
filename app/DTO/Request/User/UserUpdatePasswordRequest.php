<?php

namespace App\DTO\Request\User;

class UserUpdatePasswordRequest
{
  public ?string $oldPassword;
  public ?string $newPassword;
  public ?string $confirmPassword;

}