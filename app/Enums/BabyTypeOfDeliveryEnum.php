<?php

namespace App\Enums;

enum BabyTypeOfDeliveryEnum: int
{
  case NORMAL = 0;
  case C_SECTION = 1;
  case FORSEP = 2;


  public function label(): string
  {
    return match ($this) {
      self::NORMAL => "Persalinan spontan (normal)",
      self::C_SECTION => "Persalinan Sectio Caesarea (Operasi Caesar)",
      self::FORSEP => "Persalinan dengan Tindakan (Forsep/Vakum)",
    };
  }

  public function label_id(): string
  {
    return match ($this) {
      self::NORMAL => "Persalinan spontan (normal)",
      self::C_SECTION => "Persalinan Sectio Caesarea (Operasi Caesar)",
      self::FORSEP => "Persalinan dengan Tindakan (Forsep/Vakum)",
    };
  }

  public function value_id(): int
  {
    return match ($this) {
      self::NORMAL => 0,
      self::C_SECTION => 1,
      self::FORSEP => 2
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
