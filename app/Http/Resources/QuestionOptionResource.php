<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionOptionResource extends JsonResource
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
            'option' => $this->option,
            'option_text' => $this->option_text,
            'value' => $this->value,
            'question' => new QuestionResource($this->whenLoaded('question'))
        ];
    }
}
