<?php

namespace App\Enums;

enum BabyConditionEnum: int
{
  case LIVE = 0;
  case LIVE_ASPHYXIA = 1;
  case STILLBIRTH = 2;
  case NICU = 3;

  public function label(): string
  {
    return match ($this) {
      self::LIVE => "Live Birth",
      self::LIVE_ASPHYXIA => "Live Birth with Asphyxia",
      self::STILLBIRTH => "Stillbirth",
      self::NICU => "NICU"
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::LIVE => "Bayi lahir hidup",
      self::LIVE_ASPHYXIA => "Bayi lahir hidup dengan asfiksia",
      self::STILLBIRTH => "Bayi lahir mati",
      self::NICU => "NICU (Data Lama)"
    };
  }

  public function value_id(): int
  {
    return match ($this) {
      self::LIVE => 0,
      self::LIVE_ASPHYXIA => 1,
      self::STILLBIRTH => 2,
      self::NICU => 3
    };
  }


  public static function options(): array
  {
    // Hanya menampilkan 3 opsi terbaru untuk form dropdown
    return collect([self::LIVE, self::LIVE_ASPHYXIA, self::STILLBIRTH])->map(fn($case) => [
      'value' => $case->value_id(),
      'label' => $case->label_id(),
    ])->toArray();
  }
}
