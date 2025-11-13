<?php

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PatientUpdateRequestValidator extends FormRequest
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
            'phone_number' => ['required', 'string', 'max:50'],
            'birthplace' => ['required', 'string', 'max:50'],
            'date_of_birth' => ['date'],
            'job' => ['required', 'string', 'max:255'],
            'married_status' => [Rule::in(['married', 'not_married', 'divorced'])],
            'highest_education' => ['required', 'string', 'max:10'],
            'province' => ['required', 'string', 'max:50'],
            'city_or_district' => ['required', 'string', 'max:50'],
            'subdistrict' => ['required', 'string', 'max:50'],
            'village' => ['required', 'string', 'max:50'],

            'province_id' => ['required', 'string', 'max:50'],
            'city_or_district_id' => ['required', 'string', 'max:50'],
            'subdistrict_id' => ['required', 'string', 'max:50'],
            'village_id' => ['required', 'string', 'max:50'],

            'address' => ['nullable', 'string'],
        ];
    }
}
