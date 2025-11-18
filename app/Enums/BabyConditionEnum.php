<?php

namespace App\Enums;

enum BabyConditionEnum: int
{
  case HEALTHY = 0;
  case PREMATURE = 1;
  case LOW_BW = 2;
  case NICU = 3;

  public function label(): string
  {
    return match ($this) {
      self::HEALTHY => "Healthy",
      self::PREMATURE => "Premature",
      self::LOW_BW => "Low Body Weight",
      self::NICU => "NICU"
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::HEALTHY => "Sehat",
      self::PREMATURE => "Prematur",
      self::LOW_BW => "Berat Badan Rendah",
      self::NICU => "NICU"
    };
  }


  public static function options(): array
  {
    return collect(self::cases())->map(fn($case) => [
      'value' => $case->value,
      'label' => $case->label(),
    ])->toArray();
  }
}
