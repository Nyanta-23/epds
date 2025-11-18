<?php

namespace App\Enums;

enum FollowUpStatusEnum: int
{
  case NOT_COUNSULED = 0;
  case COUNSULED = 1;
  case REFER_PSYCHOATIRST = 2;
  case REFER_PSYCHOLOGIST = 3;

  public function label(): string
  {
    return match ($this) {
      self::NOT_COUNSULED => 'Not Counseled',
      self::COUNSULED => 'Counseled',
      self::REFER_PSYCHOATIRST => 'Referred to Psychiatrist',
      self::REFER_PSYCHOLOGIST => 'Referred to Psychologist',
    };
  }
  
  public function label_id(): string
  {
    return match ($this) {
      self::NOT_COUNSULED => 'Belum Konseling',
      self::COUNSULED => 'Sudah Konseling',
      self::REFER_PSYCHOATIRST => 'Rujuk Psikiater',
      self::REFER_PSYCHOLOGIST => 'Rujuk Psikologi',
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
