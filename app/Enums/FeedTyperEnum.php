<?php

namespace App\Enums;

enum FeedTyperEnum: int
{
  case EXCLUSIVE = 0;
  case MIXED = 1;
  case FORMULA = 2;

  public function label(): string
  {
    return match ($this) {
      self::EXCLUSIVE => 'Exclusive',
      self::MIXED => 'Mixed',
      self::FORMULA => 'Formula',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::EXCLUSIVE => 'ASI Eksklusif',
      self::MIXED => 'Campuran',
      self::FORMULA => 'Susu Formula',
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
