<?php

namespace App\Http\Requests\QuestionOption;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuestionOptionUpdateRequestValidator extends FormRequest
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

        $optionQuestionId = $this->route('option_question');
        $questionId = $this->route('question');

        return [
            // 'option' => [
            //     'required',
            //     'string',
            //     'size:1',
            //     Rule::unique('option_questions', 'option')
            //         ->where('question_id', $questionId)
            //         ->ignore($optionQuestionId),
            // ],

            'option_text' => [
                'required',
                'string'
            ],

            'value' => [
                'required',
                'integer'
            ],

            // 'question_id' => [
            //     'required',
            //     'uuid',
            //     Rule::exists('questions', 'id')
            // ]
        ];
    }
}
