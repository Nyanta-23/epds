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

            'family_salary_permonth' => [
                'value' => $this->family_salary_permonth,
                'label' => $this->family_salary_permonth->label(),
                'label_id' => $this->family_salary_permonth->label_id(),
            ],

            'psych_history' => $this->psych_history,
            'psych_treatment' => $this->psych_treatment,
            'psych_trauma' => $this->psych_trauma,

            'feel_unsafe' => [
                'value' => $this->feel_unsafe,
                'label' => $this->feel_unsafe?->label(),
                'label_id' => $this->feel_unsafe?->label_id(),
            ],

            'parity_count' => $this->parity_count,
            'pregnancy_planned' => [
                'value' => $this->pregnancy_planned,
                'label' => $this->pregnancy_planned?->label(),
                'label_id' => $this->pregnancy_planned?->label_id(),
            ],

            'last_comp' => $this->last_comp,
            'last_comp_note' => $this->last_comp_note,

            'preg_comp_history' => $this->preg_comp_history,

            'baby_healthy' => [
                'value' => $this->baby_healthy,
                'label' => $this->baby_healthy->label(),
                'label_id' => $this->baby_healthy->label_id(),
            ],
            'dependent_family_count' => [
                'value' => $this->dependent_family_count,
                'label' => $this->dependent_family_count->label(),
                'label_id' => $this->dependent_family_count->label_id(),
            ],
            'is_salary_sufficient' => [
                'value' => $this->is_salary_sufficient,
                'label' => $this->is_salary_sufficient->label(),
                'label_id' => $this->is_salary_sufficient->label_id(),
            ],

            'baby_caregiver' => [
                'value' => $this->baby_caregiver,
                'label' => $this->baby_caregiver_label,
            ],

            'feed_type' => [
                'value' => $this->feed_type,
                'label' => $this->feed_type->label(),
                'label_id' => $this->feed_type->label_id(),
            ],

            'mother' => new PatientResource($this->whenLoaded('mother')),
            'result' => new ResultResource($this->whenLoaded('result')),
            'answers' => AnswerResource::collection($this->whenLoaded('answers')),
            'followup' => new FollowUpResource($this->whenLoaded('followup'))
        ];
    }
}
