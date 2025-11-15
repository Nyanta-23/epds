<?php

namespace App\Service\Question;

use App\DTO\Request\Question\QuestionUpdateAttributeRequest;
use App\Models\Question;
use Illuminate\Support\Facades\DB;

class QuestionService
{

  public function index()
  {

    $query = Question::with('optionQuestions')->get();

    return $query;
  }

  public function update(QuestionUpdateAttributeRequest $request, string $id)
  {
    return DB::transaction(function () use ($request, $id) {
      Question::findOrFail($id)->update([
        // 'number_question' => $request->number_question,
        'question' => $request->question,
      ]);
    });
  }
}
