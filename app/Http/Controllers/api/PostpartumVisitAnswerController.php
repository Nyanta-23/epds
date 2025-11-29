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

class PostpartumVisitAnswerController extends Controller
{


    public function __construct(
        private PostpartumVisitService $postpartumVisitService,
        private AnswerService $answerService,
        private ResultService $resultService,
        private AiPostpartumResultService $aiService
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


            $postpartumVisitId = $postpartumVisit->id;


            $answerReq = [];

            foreach ($request->answers as $ans) {

                $answer = new AnswerPostAttributeRequest();
                $answer->answer = $ans['answer'];
                $answer->question_id = $ans['question_id'];
                $answer->postpartum_visit_id  = $postpartumVisitId;

                $answerReq[] = $answer;
            }


            $answers = $this->answerService->storeMany($answerReq);


            $questionAnswereds = $this->answerService->getAnswersByPostpartumVisitId($postpartumVisitId);


            $totalScore = 0;


            $questionAndAnswer = [];

            foreach ($questionAnswereds as $answer) {

                $userAnswer = strtolower($answer->answer);

                $matchedOption = $answer->question->optionQuestions
                    ->firstWhere('option', $userAnswer);


                $questionAndAnswer[] = [
                    'question' => $answer->question->question,
                    'answer' => $matchedOption->option_text
                ];

                if ($matchedOption) {
                    $totalScore += $matchedOption->value;
                }
            }

            $result = new ResultPostAttributeRequest();
            $result->total_score = $totalScore;
            $result->followup_status = 0;
            $result->postpartum_visit_id = $postpartumVisitId;

            $postpartum = $this->postpartumVisitService->getPostpartumVisitById($postpartumVisitId);

            $result =  $this->resultService->store($result);

            $dataAi = [
                'total_score' => $totalScore,
                'result_epds' => interpreted_score($totalScore),
                'partner_support' => $postpartum->partner_support->label_id(),
                'family_economy' => $postpartum->family_economy->label_id(),
                'feed_type' => $postpartum->feed_type->label_id(),
                'sleep_quality' => $postpartum->sleep_quality->label_id(),

                'psych_history' => $postpartum->psych_history ? 'Ya' : 'Tidak',
                'baby_healthy'  => $postpartum->baby_healthy ? 'Sehat' : 'Tidak Sehat',
                'question_and_answer' => $questionAndAnswer
            ];


            $rule = RecomendationRule::where(function ($q) use ($totalScore) {
                $q->where('min_score', '<=', $totalScore)
                    ->orWhereNull('min_score');
            })
                ->where(function ($q) use ($totalScore) {
                    $q->where('max_score', '>=', $totalScore)
                        ->orWhereNull('max_score');
                })
                ->first();


            // if ($rule && $rule->recommendationVariations->count() > 0) {

            //     // CASE A — PAKAI DB (random variation)
            //     $variation = $rule->recommendationVariations->random();

            //     AutoRecommendation::create([
            //         'result_id' => $result->id,
            //         'recommendation_variation_id' => $variation->id,
            //     ]);

            //     $finalRecommendationText = $variation->recommendation_text;
            // } else {

            // CASE B — TIDAK ADA RULE → GENERATE AI
            $aiText = $this->aiService->analyze($dataAi);

            $variation = RecomendationVariation::create([
                'recomendation_rule_id' => $rule?->id,
                'recomendation_text' => $aiText,
                'generated_at' => now(),
            ]);

            $aiResult = AutoRecomendation::create([
                'result_id' => $result->id,
                'recomendation_variation_id' => $variation->id,
            ]);

            // }


            $result->load('autoRecomendation.recomendationVariation');


            return  response()->json([
                'message' => 'Successfully store data',
                'postpartum_visit' => $postpartumVisitReq,
                'answers' => $answers,
                'result' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
