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
            'which_child' => $this->wich_child,
            'date_of_birth' => $this->date_of_birth,
            'baby_condition' => $this->baby_condition,
            ''
        ];
    }
}
