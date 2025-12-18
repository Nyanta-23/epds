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
      self::MIXED => 'Campuran ASI dan Susu Formula',
      self::FORMULA => 'Susu Formula',
    };
  }

  public function value_id(): int
  {
    return match ($this) {
      self::EXCLUSIVE => 0,
      self::MIXED => 1,
      self::FORMULA => 2,
    };
  }

  public static function options(): array
  {
    return collect(self::cases())->map(fn($case) => [
      'value' => $case->value_id(),
      'label' => $case->label_id(),
    ])->toArray();
  }
}
