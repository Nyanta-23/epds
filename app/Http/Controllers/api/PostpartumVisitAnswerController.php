<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\Answer\AnswerPostAttributeRequest;
use App\DTO\Request\PostpartumVisit\PostpartumVisitStoreAttributeRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\PostpartumVisitAnswerStoreRequest;
use App\Service\Answer\AnswerService;
use App\Service\PostpartumVisit\PostpartumVisitService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostpartumVisitAnswerController extends Controller
{


    public function __construct(
        private PostpartumVisitService $postpartumVisitService,
        private AnswerService $answerService
    ) {}

    public function store(PostpartumVisitAnswerStoreRequest $request)
    {
        try {

            $thisIsMy = auth()->user();
            // postpartum

            $postpartumVisitReq = new PostpartumVisitStoreAttributeRequest();

            $postpartumVisitReq->visit_number = (int) $request->post('visit_number');

            $postpartumVisitReq->date_filled = (string) $request->post('date_filled');

            $postpartumVisitReq->sleep_quality   = (int) $request->post('sleep_quality');
            $postpartumVisitReq->partner_support = (int) $request->post('partner_support');
            $postpartumVisitReq->family_economy  = (int) $request->post('family_economy');

            $postpartumVisitReq->live_with_partner = filter_var($request->post('live_with_partner'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_history = filter_var($request->post('psych_history'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_treatment = filter_var($request->post('psych_treatment'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_trauma = filter_var($request->post('psych_trauma'), FILTER_VALIDATE_BOOL);

            $postpartumVisitReq->preg_comp_history = filter_var($request->post('preg_comp_history'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->last_comp         = filter_var($request->post('last_comp'), FILTER_VALIDATE_BOOL);

            $postpartumVisitReq->last_comp_note = $request->post('last_comp_note') !== null
                ? (string) $request->post('last_comp_note')
                : null;

            $postpartumVisitReq->parity_count = (string) $request->post('parity_count');

            $postpartumVisitReq->baby_healthy = filter_var($request->post('baby_healthy'), FILTER_VALIDATE_BOOL);


            $postpartumVisitReq->baby_caregiver = (int) $request->post('baby_caregiver');
            $postpartumVisitReq->feed_type = (int) $request->post('feed_type');

            $postpartumVisitReq->mother_id = (string) $thisIsMy->id;

            $postpartumVisit = $this->postpartumVisitService->store($postpartumVisitReq);

            // dd($postpartumVisit);

            // Log::info('DEBUG ID', [$postpartumVisit->id]);


            // dump($postpartumVisit);



            $postpartumVisitId = $postpartumVisit->id;

            // Log::info('asd', [$postpartumVisit]);


            foreach ($request->answers as $ans) {

                $answer = new AnswerPostAttributeRequest();
                $answer->answer = $ans['answer'];
                $answer->question_id = $ans['question_id'];
                $answer->postpartum_visit_id  = $postpartumVisitId;

                $answerReq[] = $answer;
            }


            // dump($answerReq);


            $this->answerService->storeMany($answerReq);



            return  response()->json([
                'message' => 'Successfully store data',
                'postpartum_visit' => $postpartumVisitReq,
                'answers' => $answerReq
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
