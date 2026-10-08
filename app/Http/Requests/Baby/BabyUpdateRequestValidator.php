<?php

namespace App\Http\Requests\Baby;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'typeof_delivery' => ['sometimes', 'integer', 'between:0,2'],
            'gender' => ['sometimes', 'in:male,female'],
            'mother_id' => ['sometimes', 'uuid', $this->motherExistsRule()],
            'baby_feeding_method' => ['sometimes', 'integer'],
        ];
    }

    private function motherExistsRule(): \Illuminate\Validation\Rules\Exists
    {
        $rule = Rule::exists('users', 'id')->whereNull('deleted_at');
        $user = $this->user();

        if ($user?->role?->slug === 'midwife') {
            return $rule->where('facility_id', $user->facility_id ?? '');
        }

        if ($user?->role?->slug === 'patient') {
            return $rule->where('id', $user->id);
        }

        return $rule;
    }
}
