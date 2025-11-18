<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostpartumVisitResource extends JsonResource
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
            'visit_number' => $this->visit_number,
            'date_filled' => $this->date_filled,

            'sleep_quality' => [
                'value' => $this->sleep_quality,
                'label' => $this->sleep_quality->label(),
                'label_id' => $this->sleep_quality->label_id(),
            ],

            'partner_support' => [
                'value' => $this->partner_support,
                'label' => $this->partner_support->label(),
                'label_id' => $this->partner_support->label_id(),
            ],

            'live_with_partner' => $this->live_with_partner,

            'family_economy' => [
                'value' => $this->family_economy,
                'label' => $this->family_economy->label(),
                'label_id' => $this->family_economy->label_id(),
            ],

            'psych_history' => $this->psych_history,
            'psych_treatment' => $this->psych_treatment,
            'psych_trauma' => $this->psych_trauma,

            'parity_count' => $this->parity_count,
            
            'last_comp' => $this->last_comp,
            'last_comp_note' => $this->last_comp_note,

            'preg_comp_history' => $this->preg_comp_history,

            'baby_healthy' => $this->baby_healthy,

            'baby_caregiver' => [
                'value' => $this->baby_caregiver,
                'label' => $this->baby_caregiver->label(),
                'label_id' => $this->baby_caregiver->label_id(),
            ],

            'feed_type' => [
                'value' => $this->feed_type,
                'label' => $this->feed_type->label(),
                'label_id' => $this->feed_type->label_id(),
            ],

            'mother' => new PatientResource($this->whenLoaded('mother')),
            'result' => new ResultResource($this->whenLoaded('result')),
            'answers' => AnswerResource::collection($this->whenLoaded('answers')),

        ];
    }
}
