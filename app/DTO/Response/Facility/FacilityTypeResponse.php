<?php

namespace App\DTO\Response\Facility;

class FacilityTypeResponse
{
    /**
     * @param  array<int, array{id: string, name: string}>  $data
     */
    public function __construct(public array $data) {}
}
