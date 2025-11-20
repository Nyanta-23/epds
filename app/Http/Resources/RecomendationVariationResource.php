<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecomendationVariationResource extends JsonResource
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
            'recomendation_text' => $this->recomendation_text,
            'generated_at' => $this->generated_at,
            'recomendation_rule' => new RecomendationRuleResource($this->whenLoaded('recomendationRule')),
        ];
    }
}
