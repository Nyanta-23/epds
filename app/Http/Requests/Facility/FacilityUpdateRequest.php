<?php

namespace App\Http\Requests\Facility;

use Illuminate\Foundation\Http\FormRequest;

class FacilityUpdateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:200'],
            'facility_type_id' => ['required', 'uuid', 'exists:facility_types,id,deleted_at,NULL'],
            'parent_id' => ['nullable', 'uuid', \Illuminate\Validation\Rule::notIn([$this->route('facility')?->id]), 'exists:facilities,id,deleted_at,NULL'],
            'province_id' => ['required', 'string', 'size:2', 'exists:provinces,id'],
            'regency_id' => ['required', 'string', 'size:4', \Illuminate\Validation\Rule::exists('regencies', 'id')->where('province_id', $this->input('province_id'))],
            'district_id' => ['required', 'string', 'size:7', \Illuminate\Validation\Rule::exists('districts', 'id')->where('regency_id', $this->input('regency_id'))],
            'village_id' => ['required', 'string', 'size:10', \Illuminate\Validation\Rule::exists('villages', 'id')->where('district_id', $this->input('district_id'))],
        ];
    }
}
