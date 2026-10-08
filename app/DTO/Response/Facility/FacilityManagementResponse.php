<?php

namespace App\DTO\Response\Facility;

class FacilityManagementResponse
{
    public function __construct(
        public FacilityTypeResponse $facilityTypes,
        public FacilityResponse $facilities,
    ) {}
}
