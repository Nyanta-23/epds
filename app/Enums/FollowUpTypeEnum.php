<?php

namespace App\Enums;

enum FollowUpTypeEnum: int
{
  case EDUCATION = 0;
  case REFERENCE = 1;
  case MONITORING = 2;

  public function label(): string
  {
    return match ($this) {
      self::EDUCATION => 'Education',
      self::REFERENCE => 'Reference',
      self::MONITORING => 'Monitoring',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::EDUCATION => 'Edukasi',
      self::REFERENCE => 'Rujukan',
      self::MONITORING => 'Monitoring',
    };
  }

  public static function options(): array
  {
    return collect(self::cases())->map(fn($case) => [
      'value' => $case->value,
      'label' => $case->label_id(),
    ])->toArray();
  }
}
