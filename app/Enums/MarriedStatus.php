<?php

namespace App\Enums;

enum MarriedStatus: int
{
  case MARRIED = 0;
  case NOT_MARRIED = 1;
  case DIVORCED = 2;


  public function label(): string
  {
    return match ($this) {
      self::MARRIED => 'Married',
      self::NOT_MARRIED => 'Not Married',
      self::DIVORCED => 'Divorced'
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::MARRIED => 'Menikah',
      self::NOT_MARRIED => 'Belum Menikah',
      self::DIVORCED => 'Janda'
    };
  }
}
