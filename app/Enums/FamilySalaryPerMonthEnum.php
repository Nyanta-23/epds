<?php

namespace App\Enums;

enum FamilySalaryPerMonthEnum : int
{
    case LESS_THAN_4M = 0;
    case BETWEEN_4M_AND_8M = 1;
    case MORE_THAN_8M = 2;

    public function label(): string
    {
        return match ($this) {
            self::LESS_THAN_4M => 'Rp3.863.692',
            self::BETWEEN_4M_AND_8M => 'Rp3.863.692 - Rp7.700.000',
            self::MORE_THAN_8M => '> Rp.7.700.000'
        };
    }
    public function label_id(): string
    {
        return match ($this) {
            self::LESS_THAN_4M => 'Rp3.863.692',
            self::BETWEEN_4M_AND_8M => 'Rp3.863.692 - Rp7.700.000',
            self::MORE_THAN_8M => '> Rp.7.700.000'
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