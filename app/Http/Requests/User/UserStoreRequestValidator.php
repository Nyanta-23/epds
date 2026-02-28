<?php

namespace App\Http\Requests\User;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserStoreRequestValidator extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Apakah role yang dipilih adalah Bidan (midwife)?
   */
  private function isMidwife(): bool
  {
    $roleId = $this->input('role_id');
    if (!$roleId)
      return false;

    return Role::where('id', $roleId)
      ->where('slug', 'midwife')
      ->exists();
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    $isMidwife = $this->isMidwife();

    return [
      'name' => [
        'required',
        'string',
        'max:255'
      ],
      'email' => [
        'required',
        'unique:users,email',
        'string',
        'max:255'
      ],
      'password' => [
        'required',
        'min:8',
        'confirmed'
      ],
      'role_id' => [
        'required',
        Rule::exists('roles', 'id')->where(function ($query) {
          $query->where('deleted_at', null);
        }),
      ],
      // Wilayah hanya wajib diisi untuk Bidan
      'province_id' => [$isMidwife ? 'required' : 'nullable'],
      'regency_id' => [$isMidwife ? 'required' : 'nullable'],
      'district_id' => [$isMidwife ? 'required' : 'nullable'],
      'village_id' => [$isMidwife ? 'required' : 'nullable'],
      'province' => [$isMidwife ? 'required' : 'nullable', 'string', 'max:100'],
      'regency' => [$isMidwife ? 'required' : 'nullable', 'string', 'max:100'],
      'district' => [$isMidwife ? 'required' : 'nullable', 'string', 'max:100'],
      'village' => [$isMidwife ? 'required' : 'nullable', 'string', 'max:100'],
    ];
  }
}
