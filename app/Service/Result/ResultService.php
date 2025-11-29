<?php

namespace App\Service\Result;

use App\DTO\Request\Result\ResultPostAttributeRequest;
use App\Models\Result;
use Illuminate\Support\Facades\DB;

class ResultService
{

  public function store(ResultPostAttributeRequest $request)
  {
    return DB::transaction(function () use ($request) {

      return Result::create([
        'total_score' => $request->total_score,
        'followup_status' => $request->followup_status,
        'postpartum_visit_id' => $request->postpartum_visit_id
      ]);
    });
  }
}
