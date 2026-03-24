<?php

namespace App\Enums;

enum FollowUpStatusEnum: int
{
  case RUJUKAN_PUSKESMAS = 0;
  case RUJUKAN_PSIKOLOGI = 1;
  case RUJUKAN_PSIKIATER = 2;
  case RUJUKAN_RUMAH_SAKIT = 3;

  public function label(): string
  {
    return match ($this) {
      self::RUJUKAN_PUSKESMAS   => 'Rujukan ke Puskesmas',
      self::RUJUKAN_PSIKOLOGI   => 'Rujukan ke Psikologi',
      self::RUJUKAN_PSIKIATER   => 'Rujukan ke Psikiater',
      self::RUJUKAN_RUMAH_SAKIT => 'Rujukan ke Rumah Sakit',
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::RUJUKAN_PUSKESMAS   => 'Rujukan ke Puskesmas',
      self::RUJUKAN_PSIKOLOGI   => 'Rujukan ke Psikologi',
      self::RUJUKAN_PSIKIATER   => 'Rujukan ke Psikiater',
      self::RUJUKAN_RUMAH_SAKIT => 'Rujukan ke Rumah Sakit',
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
