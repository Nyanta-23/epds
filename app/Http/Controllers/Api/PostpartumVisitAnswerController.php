<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\Answer\AnswerPostAttributeRequest;
use App\DTO\Request\PostpartumVisit\PostpartumVisitStoreAttributeRequest;
use App\DTO\Request\Result\ResultPostAttributeRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\PostpartumVisitAnswerStoreRequest;
use App\Models\AutoRecomendation;
use App\Models\RecomendationRule;
use App\Models\RecomendationVariation;
use App\Service\AiPostpartumResultService;
use App\Service\Answer\AnswerService;
use App\Service\PostpartumVisit\PostpartumVisitService;
use App\Service\Result\ResultService;
use DB;

class PostpartumVisitAnswerController extends Controller
{


    public function __construct(
        private PostpartumVisitService $postpartumVisitService,
        private AnswerService $answerService,
        private ResultService $resultService,
        private AiPostpartumResultService $aiService
    ) {}

    public function store(PostpartumVisitAnswerStoreRequest $request){

    return DB::transaction(function () use ($request) {
        try {
            $user = auth()->user();
            $validated = $request->validated();

            $postpartumVisitReq = new PostpartumVisitStoreAttributeRequest();
            
            $postpartumVisitReq->visit_number = $validated['visit_number'];
            $postpartumVisitReq->date_filled = $validated['date_filled'];
            $postpartumVisitReq->sleep_quality = $validated['sleep_quality'];
            $postpartumVisitReq->partner_support = $validated['partner_support'];
            $postpartumVisitReq->family_salary_permonth = $validated['family_salary_permonth'];
            $postpartumVisitReq->dependent_family_count = $validated['dependent_family_count'];
            $postpartumVisitReq->is_salary_sufficient = $validated['is_salary_sufficient'];
            $postpartumVisitReq->live_with_partner = $validated['live_with_partner'];
            $postpartumVisitReq->psych_history = $validated['psych_history'];
            $postpartumVisitReq->psych_treatment = $validated['psych_treatment'];
            $postpartumVisitReq->psych_trauma = $validated['psych_trauma'];
            $postpartumVisitReq->preg_comp_history = $validated['preg_comp_history'];
            $postpartumVisitReq->last_comp = $validated['last_comp'];
            $postpartumVisitReq->last_comp_note = $validated['last_comp_note'] ?? null;
            $postpartumVisitReq->parity_count = $validated['parity_count'];
            $postpartumVisitReq->baby_healthy = $validated['baby_healthy'];
            $postpartumVisitReq->baby_caregiver = $validated['baby_caregiver'];
            $postpartumVisitReq->feed_type = $validated['feed_type'];
            $postpartumVisitReq->mother_id = $user->id;
            $postpartumVisit = $this->postpartumVisitService->store($postpartumVisitReq);


            $answerReq = [];
            
            foreach ($validated['answers'] as $ans) {
                $answerDTO = new AnswerPostAttributeRequest();
                $answerDTO->answer = $ans['answer'];
                $answerDTO->question_id = $ans['question_id'];
                $answerDTO->postpartum_visit_id = $postpartumVisit->id;
                $answerReq[] = $answerDTO;
            }

            $this->answerService->storeMany($answerReq);

            $questionAnswereds = $this->answerService->getAnswersByPostpartumVisitId($postpartumVisit->id);
            
            $totalScore = 0;
            foreach ($questionAnswereds as $answer) {
                $userAnswer = strtolower($answer->answer); 
                
                $matchedOption = $answer->question->optionQuestions
                    ->firstWhere('option', $userAnswer);

                if ($matchedOption) {
                    $totalScore += $matchedOption->value;
                }
            }

            $resultDTO = new ResultPostAttributeRequest();
            $resultDTO->total_score = $totalScore;
            $resultDTO->followup_status = 0;
            $resultDTO->postpartum_visit_id = $postpartumVisit->id;

            $savedResult = $this->resultService->store($resultDTO);

            $recommendation = RecomendationRule::query()
                ->where(function ($q) use ($totalScore) {
                    $q->where('min_score', '<=', $totalScore)->orWhereNull('min_score');
                })
                ->where(function ($q) use ($totalScore) {
                    $q->where('max_score', '>=', $totalScore)->orWhereNull('max_score');
                })
                ->first();

            $recommendationText = generate_dummy_recommendation($totalScore);;
            
            return response()->json([
                'message' => 'Successfully store data',
                'data' => [
                    'postpartum_visit_id' => $postpartumVisit->id,
                    'total_score' => $totalScore,
                    'interpretation' => interpreted_score($totalScore),
                    'recommendation' => $recommendationText,
                ]
            ], 201);

        } catch (\Exception $e) { 
            throw $e;
        }
    }); 
}
}
