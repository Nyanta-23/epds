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
      self::GOOD => '5-6 hours',
      self::POOR => 'Less than 3 hours',
      self::FAIR => '3 - 4 hours',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
       self::GOOD => '5-6 Jam',
      self::POOR => 'Kurang dari 3 Jam',
      self::FAIR => '3 - 4 Jam',
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
