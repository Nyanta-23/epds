<?php

namespace App\Http\Requests\Baby;

use Illuminate\Foundation\Http\FormRequest;

class BabyUpdateRequestValidator extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'which_child' => ['sometimes', 'integer', 'min:1'],
            'date_of_birth' => ['sometimes', 'date'],
            'baby_condition' => ['sometimes', 'integer', 'between:0,3'],
            'type_of_delivery' => ['sometimes', 'integer', 'between:0,2'],
            'gender' => ['sometimes', 'in:male,female'],
            'mother_id' => ['sometimes', 'uuid', 'exists:users,id'],
        ];
    }
}
