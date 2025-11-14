<?php

namespace App\Enums;

enum BabyTypeOfDeliveryEnum: int
{
  case NORMAL = 0;
  case C_SECTION = 1;
  case FORSEP = 2;


  public function label(): string
  {
    return match ($this) {
      self::NORMAL => "Normal",
      self::C_SECTION => "C-Section",
      self::FORSEP => "Forsep",
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::NORMAL => "Normal",
      self::C_SECTION => "Caesar",
      self::FORSEP => "Forsep",
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
