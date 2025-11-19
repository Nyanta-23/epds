<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FollowUpResource extends JsonResource
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
            'type' => [
                'value' => $this->type,
                'label' => $this->type->label(),
                'label_id' => $this->type->label_id(),
            ],
            'notes' => $this->notes,
            'date_filled' => $this->date_filled,
            'midiwfe' => new PatientResource($this->whenLoaded('mother')),
            'result' => new ResultResource($this->whenLoaded('result')),
        ];
    }
}
