<?php

namespace App\Http\Requests\FollowUp;

use Illuminate\Foundation\Http\FormRequest;

class FollowUpUpdateRequestValidator extends FormRequest
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
            'type' => ['required', 'integer', 'in:0,1,2'],

            'followup_status' => ['required', 'integer', 'in:0,1,2,3'],

            'notes' => ['required', 'string', 'max:5000'],

            'result_id' => ['uuid', 'exists:results,id'],

            'midwife_id' => ['uuid', 'exists:users,id'],
        ];
    }
}
