<?php

namespace App\Http\Controllers;

use App\DTO\Request\Question\QuestionUpdateAttributeRequest;
use App\Http\Requests\Question\QuestionUpdateRequestValidator;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Service\Question\QuestionService;
use Inertia\Inertia;

class QuestionController extends Controller
{

    public function __construct(
        private QuestionService $questionService,
    ) {}

    public function index()
    {
        $questions = $this->questionService->index();

        return Inertia::render('question', [
            'questions' => QuestionResource::collection($questions)
        ]);
    }

    public function update(QuestionUpdateRequestValidator $request, Question $question)
    {
        try {

            $request->validated();

            $questionReq = new QuestionUpdateAttributeRequest();


            // $questionReq->number_question = (int) $request->post('number_question');
            $questionReq->question = $request->post('question');

            $this->questionService->update($questionReq, $question->id);


            return redirect()->route('question')->with('success', 'Question has been updated.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }
}
