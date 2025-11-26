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
            'province_id' => $this->province_id,
            'city_or_district_id' => $this->city_or_district_id,
            'subdistrict_id' => $this->subdistrict_id,
            'village_id' => $this->village_id,
            'province' => $this->province,
            'city_or_district' => $this->city_or_district,
            'subdistrict' => $this->subdistrict,
            'village' => $this->village,
            'address' => $this->address,
            'babies' => BabyResource::collection($this->babies),
        ];
    }
}