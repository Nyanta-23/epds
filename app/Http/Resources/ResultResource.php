<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResultResource extends JsonResource
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
            'total_score' => $this->total_score,
            'followup_status' => [
                'value' => $this->followup_status,
                'label' => $this->followup_status->label(),
                'label_id' => $this->followup_status->label_id(),
            ],
            'postpartum_visit' => new PostpartumVisitResource($this->whenLoaded('postpartumVisit')),
            'follow_up' => new FollowUpResource($this->whenLoaded('followUp')),
        ];
    }
}
