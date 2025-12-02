<?php

namespace App\Http\Requests\api;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
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
            'old_password' => ['required', 'string'],
            'new_password' => ['required', 'string'],
            'confirm_password' => ['required', 'string', 'same:new_password']
        ];
    }

    public function messages(): array
    {
        return [
            'oldPassword.required' => 'password lama tidak boleh kosong',
            'oldPassword.string' => 'password lama harus berupa text',
            'newPassword.required' => 'password baru tidak boleh kosong',
            'newPassword.string' => 'password baru harus berupa text',
            'confirmPassword.required' => 'konfirmasi password tidak boleh kosong',
            'confirmPassword.string'=> 'konfirmasi password harus berupa text',
            'confirmPassword.same' => 'konfirmasi password tidak boleh berbeda'
        ];
    }
}
