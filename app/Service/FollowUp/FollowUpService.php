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

    $now = now();

    return DB::transaction(function () use ($now, $request) {
      $result = Result::findOrFail($request->result_id);

      $followUp = Followup::create([
        'postpartum_visit_id' => $request->postpartum_visit_id,
        'type' => $request->type,
        'notes' => $request->notes,
        'midwife_id' => $request->midwife_id,
        'date_filled' => $now,
      ]);

      $result->update([
        'followup_status' => $request->followup_status,
        'followup_id' => $followUp->id
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
