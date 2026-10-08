<?php

namespace App\DTO\Request\Facility;

class FacilityData
{
    /**
     * @param  array{province_id: string, regency_id: string, district_id: string, village_id: string}  $attributes
     */
    public function __construct(
        public string $name,
        public string $facility_type_id,
        public ?string $parent_id,
        public array $attributes,
    ) {}
}
