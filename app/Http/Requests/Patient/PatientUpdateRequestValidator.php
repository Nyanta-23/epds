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
            'name' => ['required', 'string', 'max:100'],
            'phone_number' => ['required', 'string', 'max:50'],
            'birthplace' => ['required', 'string', 'max:50'],
            'date_of_birth' => ['required', 'date'],
            'job' => ['required', 'string', 'max:255'],
            'married_status' => ['required', Rule::in(['married', 'not_married', 'divorced'])],
            'highest_education' => ['required', 'string', 'max:10'],
            'province' => ['sometimes', 'nullable', 'string', 'max:50'],
            'city_or_district' => ['sometimes', 'nullable', 'string', 'max:50'],
            'subdistrict' => ['sometimes', 'nullable', 'string', 'max:50'],
            'village' => ['sometimes', 'nullable', 'string', 'max:50'],

            'province_id' => ['required', 'string', Rule::exists('provinces', 'id')],
            'city_or_district_id' => [
                'required',
                'string',
                Rule::exists('regencies', 'id')->where('province_id', $this->input('province_id')),
            ],
            'subdistrict_id' => [
                'required',
                'string',
                Rule::exists('districts', 'id')->where('regency_id', $this->input('city_or_district_id')),
            ],
            'village_id' => [
                'required',
                'string',
                Rule::exists('villages', 'id')->where('district_id', $this->input('subdistrict_id')),
            ],

            'address' => ['required', 'string'],
            'facility_id' => [
                'required',
                'string',
                Rule::exists('facilities', 'id')
                    ->where('regency_id', $this->input('city_or_district_id'))
                    ->where('is_deleted', false)
                    ->whereNull('deleted_at'),
            ],
        ];
    }
}
