<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnswerResource extends JsonResource
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
            'answer' => $this->answer,
            'question' => new QuestionResource($this->whenLoaded('question')),
            'postpartum_visit' => new PostpartumVisitResource($this->whenLoaded('postpartumVisit'))
        ];
    }
}
