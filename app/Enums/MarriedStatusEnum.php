<?php

namespace App\Enums;

enum MarriedStatusEnum: int
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

   public static function options(): array
  {
    return collect(self::cases())->map(fn($case) => [
      'value' => $case->value,
      'label' => $case->label(),
    ])->toArray();
  }
}
