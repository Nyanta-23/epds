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

      Answer::create([
        'answer' => $request->answer,
        'postartum_visit_id' => $request->postpartum_visit_id,
        'question_id' => $request->question_id,
      ]);
    });
  }

  public function storeMany(array $requests)
  {

    return DB::transaction(function () use ($requests) {
      foreach ($requests as $req) {
        Answer::create([
          'answer' => $req->answer,
          'postpartum_visit_id' => $req->postpartum_visit_id,
          'question_id' => $req->question_id
        ]);
      }
    });
  }
}
