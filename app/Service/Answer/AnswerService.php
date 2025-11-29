<?php

namespace App\Service\Answer;

use App\DTO\Request\Answer\AnswerPostAttributeRequest;
use App\Models\Answer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AnswerService
{
  public function store(AnswerPostAttributeRequest $request)
  {
    return DB::transaction(function () use ($request) {

      return Answer::create([
        'answer' => $request->answer,
        'postpartum_visit_id' => $request->postpartum_visit_id,
        'question_id' => $request->question_id,
      ]);
    });
  }

  public function storeMany(array $requests)
  {

    return DB::transaction(function () use ($requests) {

      $results = [];

      foreach ($requests as $request) {
        $results[] = $this->store($request);
      }

      return $results;
    });
  }


  public function getAnswersByPostpartumVisitId(string $id)
  {
    return Answer::where('postpartum_visit_id', $id)
      ->with('question.optionQuestions')
      ->get();
  }
}
