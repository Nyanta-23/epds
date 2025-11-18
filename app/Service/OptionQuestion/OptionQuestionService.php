<?php

namespace App\Service\OptionQuestion;

use App\DTO\Request\QuestionOption\QuestionOptionAttributeRequest;
use App\Models\OptionQuestion;
use Illuminate\Support\Facades\DB;

class OptionQuestionService
{

  public function update(QuestionOptionAttributeRequest $request, string $id)
  {
    return DB::transaction(function () use ($request, $id) {
      OptionQuestion::findOrFail($id)->update([
        'option_text' => $request->option_text,
        'value' => $request->value,
      ]);
    });
  }
}
