<?php

namespace App\Enums;

enum SleepQualityEnum: int
{
  case GOOD = 0;
  case POOR = 1;
  case FREQUENTLY_AWAKE = 2;

  public function label(): string
  {
    return match ($this) {
      self::GOOD => 'Good',
      self::POOR => 'Poor',
      self::FREQUENTLY_AWAKE => 'Frequently Awake',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::GOOD => 'Baik',
      self::POOR => 'Buruk',
      self::FREQUENTLY_AWAKE => 'Sering Terbangun',
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
