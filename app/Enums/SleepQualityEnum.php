<?php

namespace App\Enums;

enum SleepQualityEnum: int
{
  case POOR = 0;
  case FAIR = 1;
  case GOOD = 2;

  public function label(): string
  {
    return match ($this) {
      self::GOOD => 'Good',
      self::POOR => 'Poor',
      self::FAIR => 'Fair',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::GOOD => 'Baik',
      self::POOR => 'Buruk',
      self::FAIR => 'Cukup',
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
