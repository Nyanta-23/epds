<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name' => 'required|max:100',
            'email' => 'email|required',
            'password' => 'required|min:8',
            'confirm_password' => 'required|min:8|same:password'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'nama tidak boleh kosong',
            'name.max' => 'nama tidak boleh lebih dari 100 huruf',
            'email.email' => 'format email tidak valid',
            'email.required' => 'email tidak boleh kosong',
            'password.required' => 'password tidak boleh kosong',
            'password.min' => 'panjang password tidak boleh kurang dari 8 karakter',
            'confirm_password.required' => 'konfirmasi password tidak boleh kosong',
            'confirm_password.min' => 'panjang konfirmasi password tidak boleh kurang dari 8 karakter',
            'confirm_password.same' => 'konfirmasi password tidak sesuai'
        ];
    }
}
