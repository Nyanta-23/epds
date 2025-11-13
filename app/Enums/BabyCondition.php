<?php

namespace App\Enums;

enum BabyCondition: int
{
  case HEALTHY = 0;
  case PREMATURE = 1;
  case LOW_BW = 2;
  case NICU = 3;

  public function lable(): string
  {
    return match ($this) {
      self::HEALTHY => "Healthy",
      self::PREMATURE => "Premature",
      self::LOW_BW => "Low Body Weight",
      self::NICU => "NICU"
    };
  }

  public function lable_id(): string
  {
    return match ($this) {
      self::HEALTHY => "Sehat",
      self::PREMATURE => "Prematur",
      self::LOW_BW => "Berat Badan Rendah",
      self::NICU => "NICU"
    };
  }
}
