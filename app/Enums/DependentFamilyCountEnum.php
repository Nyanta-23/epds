<?php

namespace App\Enums;

enum DependentFamilyCountEnum: int
{
  case ONE_TO_TWO = 0;
  case THREE_TO_FOUR = 1;
  case MORE_THAN_FIVE = 2;

  public function label(): string
  {
    return match ($this) {
      self::ONE_TO_TWO => '1-2',
      self::THREE_TO_FOUR => '3-4',
      self::MORE_THAN_FIVE => '>5',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::ONE_TO_TWO => '1-2',
      self::THREE_TO_FOUR => '3-4',
      self::MORE_THAN_FIVE => '>5',
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