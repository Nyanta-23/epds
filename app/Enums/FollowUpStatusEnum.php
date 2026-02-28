<?php

namespace App\Enums;

enum FollowUpStatusEnum: int
{
  case BELUM_ADA_TINDAKAN = 0;
  case TPMB = 1;
  case REFER_PSYCHOLOGIST = 2;
  case REFER_PSYCHOATIRST = 3;

  public function label(): string
  {
    return match ($this) {
      self::BELUM_ADA_TINDAKAN => 'No Action Yet',
      self::TPMB => 'TPMB (Tempat Praktik Mandiri Bidan)',
      self::REFER_PSYCHOLOGIST => 'Referred to Psychologist',
      self::REFER_PSYCHOATIRST => 'Referred to Psychiatrist',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::BELUM_ADA_TINDAKAN => 'Belum Ada Tindakan',
      self::TPMB => 'TPMB (Tempat Praktik Mandiri Bidan)',
      self::REFER_PSYCHOLOGIST => 'Rujuk Psikologi',
      self::REFER_PSYCHOATIRST => 'Rujuk Psikiater',
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
