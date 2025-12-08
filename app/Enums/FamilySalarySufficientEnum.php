<?php

namespace App\Enums;

enum FamilySalarySufficientEnum: int
{
    case INSUFFICIENT = 0;
    case SUFFICIENT_FOR_BASIC_NEEDS = 1;
    case SUFFICIENT_FOR_COMFORT = 2;

    public function label(): string
    {
        return match ($this) {
            self::INSUFFICIENT => 'Insufficient',
            self::SUFFICIENT_FOR_BASIC_NEEDS => 'Sufficient for Basic Needs',
            self::SUFFICIENT_FOR_COMFORT => 'Sufficient for Comfort',
        };
    }

    public function label_id(): string
    {
        return match ($this) {
            self::INSUFFICIENT => 'Tidak Cukup',
            self::SUFFICIENT_FOR_BASIC_NEEDS => 'Cukup untuk Kebutuhan Dasar',
            self::SUFFICIENT_FOR_COMFORT => 'Cukup untuk Kenyamanan',
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