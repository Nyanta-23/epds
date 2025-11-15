<?php

namespace App\Http\Controllers;

use App\DTO\Request\QuestionOption\QuestionOptionAttributeRequest;
use App\Http\Requests\QuestionOption\QuestionOptionUpdateRequestValidator;
use App\Models\OptionQuestion;
use App\Service\OptionQuestion\OptionQuestionService;

class QuestionOptionController extends Controller
{

    public function __construct(
        private OptionQuestionService $optionQuestionService,
    ) {}


    public function update(QuestionOptionUpdateRequestValidator $request, OptionQuestion $option)
    {
        try {

            $request->validated();

            $questionOptionReq = new QuestionOptionAttributeRequest();

            $questionOptionReq->option_text = $request->post('option_text');
            $questionOptionReq->value = $request->post('value');


            $this->optionQuestionService->update($questionOptionReq, $option->id);

            return redirect()->route('question')->with('success', 'Option question has been updated.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }
}
