<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostpartumVisitAnswerResource extends JsonResource
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
            'answer_score' => (int) $this->answer, // Providing both for safety
            'question_id' => $this->question_id,
            'question' => new QuestionResource($this->whenLoaded('question')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
