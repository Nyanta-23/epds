<?php

namespace App\Enums;

enum FamilyEconomyEnum: int
{
  case GOOD = 0;
  case FAIR = 1;
  case POOR = 2;

  public function label(): string
  {
    return match ($this) {
      self::GOOD => 'Good',
      self::FAIR => 'Fair',
      self::POOR => 'Poor',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::GOOD => 'Baik',
      self::FAIR => 'Cukup',
      self::POOR => 'Buruk',
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
