<?php

namespace App\DTO\Response\Facility;

class Facility
{
    public function __construct(
        public string $id,
        public string $name,
        public string $facility_type,
        public string $address,
        public $children = []
    ) {}
}
