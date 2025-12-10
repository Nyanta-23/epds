<?php

namespace App\Enums;

enum BabyCaregiverEnum: int
{
  case PARTNER = 0;
  case PARENTS = 1;
  case FAMILY_OR_NANNY = 2;
  case NONE = 3;

  public function label(): string
  {
    return match ($this) {
      self::PARTNER => 'Partner',
      self::PARENTS => 'Parents',
      self::FAMILY_OR_NANNY => 'Family or Nanny',
      self::NONE => 'Alone',
    };
  }

  public static function getLabelsFromIds(?array $ids): array
    {
        if (empty($ids)) return [];

        return collect($ids)
            ->map(function ($id) {
                $enum = self::tryFrom((int) $id);
                return $enum ? $enum->label_id() : null;
            })
            ->filter()
            ->values() 
            ->toArray();
    }

  public function label_id(): string
  {
    return match ($this) {
      self::PARTNER => 'Pasangan',
      self::PARENTS => 'Orang Tua',
      self::FAMILY_OR_NANNY => 'Keluarga atau Pengasuh',
      self::NONE => 'Sendiri',
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
