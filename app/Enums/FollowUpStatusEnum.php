<?php

namespace App\Enums;

enum FollowUpStatusEnum: int
{
  case NOT_FOLLOWED_UP = 0;
  case RUJUKAN_PUSKESMAS = 1;
  case RUJUKAN_PSIKOLOGI = 2;
  case RUJUKAN_PSIKIATER = 3;
  case RUJUKAN_RUMAH_SAKIT = 4;
  case HANDLED = 5;

  public function label(): string
  {
    return match ($this) {
      self::NOT_FOLLOWED_UP   => 'Not Followed Up',
      self::RUJUKAN_PUSKESMAS   => 'Rujukan ke Puskesmas',
      self::RUJUKAN_PSIKOLOGI   => 'Rujukan ke Psikologi',
      self::RUJUKAN_PSIKIATER   => 'Rujukan ke Psikiater',
      self::RUJUKAN_RUMAH_SAKIT => 'Rujukan ke Rumah Sakit',
      self::HANDLED             => 'Already Handled / Counseling',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::NOT_FOLLOWED_UP     => 'Belum ada tindakan',
      self::RUJUKAN_PUSKESMAS   => 'Rujukan ke Puskesmas',
      self::RUJUKAN_PSIKOLOGI   => 'Rujukan ke Psikologi',
      self::RUJUKAN_PSIKIATER   => 'Rujukan ke Psikiater',
      self::RUJUKAN_RUMAH_SAKIT => 'Rujukan ke Rumah Sakit',
      self::HANDLED             => 'Sudah Ditangani / Konseling',
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
