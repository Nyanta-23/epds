<?php

namespace App\Enums;

enum PregnancyPlannedEnum: int
{
    case NO = 0;
    case YES = 1;
    case PREFER_NOT_TO_SAY = 2;

    public function label(): string
    {
        return match ($this) {
            self::NO => 'Tidak',
            self::YES => 'Ya',
            self::PREFER_NOT_TO_SAY => 'Tidak ingin menjawab',
        };
    }

    public function label_id(): string
    {
        return match ($this) {
            self::NO => 'Tidak',
            self::YES => 'Ya',
            self::PREFER_NOT_TO_SAY => 'Tidak ingin menjawab',
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
