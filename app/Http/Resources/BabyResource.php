<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BabyResource extends JsonResource
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
            'which_child' => $this->which_child,
            'date_of_birth' => $this->date_of_birth,
            'baby_condition' => $this->baby_condition,
            'typeof_delivery' => $this->typeof_delivery,
            'gender' => $this->gender,
            'baby_condition_label' => $this->baby_condition->label(),
            'typeof_delivery_label' => $this->typeof_delivery->label(),
            'mother' => new PatientResource($this->whenLoaded('mother'))
        ];
    }
}
