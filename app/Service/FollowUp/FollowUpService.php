<?php

namespace App\Service\FollowUp;

use App\DTO\Request\FollowUp\FollowUpStoreAttributeRequest;
use App\DTO\Request\FollowUp\FollowUpUpdateAttributeRequest;
use App\Models\Followup;
use App\Models\Result;
use Illuminate\Support\Facades\DB;

class FollowUpService
{
  public function store(FollowUpStoreAttributeRequest $request)
  {

    return DB::transaction(function () use ($request) {
      $result = Result::findOrFail($request->result_id);

      Followup::create([
        'type' => $request->type,
        'notes' => $request->notes,
        'midwife_id' => $request->midiwfe_id,
        'result_id' => $request->result_id
      ]);

      $result->update([
        'followup_status' => $request->followup_status
      ]);
    });
  }

  public function update(FollowUpUpdateAttributeRequest $request, string $id)
  {

    return DB::transaction(function () use ($request, $id) {
      $result = Result::findOrFail($request->result_id);
      $followUp = Followup::findOrFail($id);

      $result->update([
        'followup_status' => $request->followup_status
      ]);

      $followUp->update([
        'type' => $request->type,
        'notes' => $request->notes
      ]);
    });
  }
}
