<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
      'role' => new RoleResource($this->whenLoaded('role')),
      'province_id' => $this->province_id ?? '',
      'regency_id' => $this->city_or_district_id ?? '',
      'district_id' => $this->subdistrict_id ?? '',
      'village_id' => $this->village_id ?? '',
      'province' => $this->province ?? '',
      'city_or_district' => $this->city_or_district ?? '',
      'subdistrict' => $this->subdistrict ?? '',
      'village' => $this->village ?? ''
    ];
  }
}
