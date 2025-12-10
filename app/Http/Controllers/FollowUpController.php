<?php

namespace App\Http\Controllers;

use App\DTO\Request\FollowUp\FollowUpStoreAttributeRequest;
use App\DTO\Request\FollowUp\FollowUpUpdateAttributeRequest;
use App\Http\Requests\FollowUp\FollowUpStoreRequestValidator;
use App\Http\Requests\FollowUp\FollowUpUpdateRequestValidator;
use App\Models\Followup;
use App\Service\FollowUp\FollowUpService;
use Illuminate\Http\Request;

class FollowUpController extends Controller
{

    public function __construct(
        private FollowUpService $followUpService
    ) {}

    public function store(FollowUpStoreRequestValidator $request, $postpartum)
    {
        try {

            $user = auth()->user();

            $request->validated();

            $followUpReq = new FollowUpStoreAttributeRequest();

            $followUpReq->postpartum_visit_id = $postpartum;
            $followUpReq->followup_status = $request->post('followup_status');
            $followUpReq->notes = $request->post('notes');
            $followUpReq->type = $request->post('type');
            $followUpReq->result_id = $request->post('result_id');
            $followUpReq->midwife_id = $user->id;

            $this->followUpService->store($followUpReq);

            return redirect()->route('postpartum')->with('success', 'Success adding follow up.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }

    public function update(FollowUpUpdateRequestValidator $request, Followup $followup)
    {
        try {

            $user = auth()->user();

            // $role = $user->role->slug;

            $request->validated();

            $followUpReq = new FollowUpUpdateAttributeRequest();

            // if ($role != "midiwife") {
            //     $followUpReq->followup_status = $request->post('followup_status');
            //     $followUpReq->notes = $request->post('notes');
            //     $followUpReq->type = $request->post('type');
            //     $followUpReq->result_id = $followup->result->id;
            // } else {
            //     $followUpReq->followup_status = $request->post('followup_status');
            //     $followUpReq->notes = $request->post('notes');
            //     $followUpReq->type = $request->post('type');
            //     $followUpReq->midiwfe_id  = $user->id;
            //     $followUpReq->result_id = $followup->result->id;
            // }

            $followUpReq->followup_status = $request->post('followup_status');
            $followUpReq->notes = $request->post('notes');
            $followUpReq->type = $request->post('type');
            $followUpReq->midwife_id  = $user->id;
            $followUpReq->result_id = $followup->result->id;


            $this->followUpService->update($followUpReq, $followup->id);



            return redirect()->route('postpartum')->with('success', 'Success update follow up.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }
}
