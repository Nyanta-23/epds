<?php

namespace App\Http\Requests\Question;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuestionUpdateRequestValidator extends FormRequest
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
            // 'number_question' => [
            //     'sometimes',
            //     'required',
            //     'integer',
            //     Rule::unique('questions', 'number_question')->ignore($this->route('id'))
            // ],

            'question' => [
                'sometimes',
                'required',
                'string'
            ]
        ];
    }
}
