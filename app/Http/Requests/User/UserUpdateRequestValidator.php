<?php

namespace App\Http\Requests\User;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequestValidator extends FormRequest
{
    private function isMidwife(): bool
    {
        return Role::query()
            ->whereKey($this->input('role_id'))
            ->where('slug', 'midwife')
            ->exists();
    }

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
        $user = $this->route('user') ?? $this->route('id');
        $isMidwife = $this->isMidwife();
        $facilityRule = Rule::exists('facilities', 'id')->whereNull('deleted_at');

        if ($this->user()?->role?->slug === 'midwife') {
            $facilityRule->where('id', $this->user()->facility_id ?? '');
        }

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user),
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
            ],
            'role_id' => [
                'required',
                Rule::exists('roles', 'id')->where(function ($query) {
                    $query->where('deleted_at', null);
                }),
            ],
            'facility_id' => [
                $isMidwife || $this->user()?->role?->slug === 'midwife' ? 'required' : 'nullable',
                'uuid',
                $facilityRule,
            ],
            'province_id' => ['nullable'],
            'regency_id' => ['nullable'],
            'district_id' => ['nullable'],
            'village_id' => ['nullable'],
            'province' => ['nullable', 'string', 'max:100'],
            'city_or_district' => ['nullable', 'string', 'max:100'],
            'subdistrict' => ['nullable', 'string', 'max:100'],
            'village' => ['nullable', 'string', 'max:100'],
            'instansi' => ['nullable', Rule::in(['TPMB', 'Puskesmas', 'Klinik', 'RS'])],
            'nama_instansi' => ['nullable', 'string', 'max:255'],
        ];
    }
}
