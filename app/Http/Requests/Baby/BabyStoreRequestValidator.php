<?php

namespace App\Http\Requests\Baby;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BabyStoreRequestValidator extends FormRequest
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
            'which_child' => ['required', 'integer', 'min:1'],
            'date_of_birth' => ['required', 'date'],
            'baby_condition' => ['required', 'integer', 'between:0,3'],
            'typeof_delivery' => ['required', 'integer', 'between:0,2'],
            'gender' => ['required', 'in:male,female'],
            'mother_id' => ['required', 'uuid', $this->motherExistsRule()],
            'baby_feeding_method' => ['required', 'integer'],
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

    /**
     * Custom validation messages
     */
    // public function messages(): array
    // {
    //     return [
    //         'which_child.required' => 'Child order is required.',
    //         'date_of_birth.required' => 'Baby\'s date of birth is required.',
    //         'baby_condition.required' => 'Baby condition is required.',
    //         'type_of_delivery.required' => 'Type of delivery is required.',
    //         'gender.in' => 'Gender must be either male or female.',
    //         'mother_id.exists' => 'Mother data not found.',
    //     ];
    // }
}
