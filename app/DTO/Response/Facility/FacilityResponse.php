<?php

namespace App\DTO\Response\Facility;

class FacilityResponse
{
    /**
     * @param  array<int, array<string, mixed>>  $data
     */
    public function __construct(public array $data) {}
}
