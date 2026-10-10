<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'birthplace' => $this->birthplace,
            'date_of_birth' => $this->date_of_birth,
            'job' => $this->job,
            'married_status' => $this->married_status,
            'highest_education' => $this->highest_education,
            'province_id' => $this->province_migrate_id ?? $this->province_id,
            'city_or_district_id' => $this->regency_migrate_id ?? $this->city_or_district_id,
            'subdistrict_id' => $this->district_migrate_id ?? $this->subdistrict_id,
            'village_id' => $this->village_migrate_id ?? $this->village_id,
            'province' => $this->provinceMigration?->name ?? $this->province,
            'city_or_district' => $this->regencyMigration?->name ?? $this->city_or_district,
            'subdistrict' => $this->districtMigration?->name ?? $this->subdistrict,
            'village' => $this->villageMigration?->name ?? $this->village,
            'address' => $this->address,
            'facility_id' => $this->facility_id,
            'facility' => $this->facility?->name,
            'number_patient' => $this->number_patient,
            'babies' => BabyResource::collection($this->babies),
        ];
    }
}
