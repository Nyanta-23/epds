<?php

namespace App\Http\Controllers;

use App\DTO\Request\PostpartumVisit\PostpartumVisitUpdateAttributeRequest;
use App\Enums\BabyCaregiverEnum;
use App\Enums\FamilyEconomyEnum;
use App\Enums\FeedTyperEnum;
use App\Enums\PartnerSupportEnum;
use App\Enums\SleepQualityEnum;
use App\Http\Requests\PostpartumVisit\PostpartumVisitUpdateRequestValidator;
use App\Http\Resources\PostpartumVisitResource;
use App\Models\PostpartumVisit;
use App\Service\PostpartumVisit\PostpartumVisitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostpartumVisitController extends Controller
{

    public function __construct(
        private PostpartumVisitService $postpartumVisitService,
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'only_trash' => $request->boolean('only_trash', false),
            'filter_list' => [
                'select_filter' => [
                    // 'role' => $request->input('role')
                    'is_verified' => $request->input('is_verified'),
                    'is_can_visit' => $request->input('is_can_visit')
                ],
                // 'checkbox_filter' => []
            ]
        ];


        $postpartumVisits = $this->postpartumVisitService->index($filters);

        return Inertia::render('postpartum', [
            'postpartums' => PostpartumVisitResource::collection($postpartumVisits),
            'page_prop' => [
                'main_link' => '',
                'filter' => $filters
            ]
        ]);
    }

    public function show(PostpartumVisit $postpartum)
    {

        $postpartum->load([
            'mother',
            'result',
            'answers.question.optionQuestions',
        ]);

        return Inertia::render('postpartum/action/postpartum-show', [
            'postpartum' => new PostpartumVisitResource($postpartum)
        ]);
    }


    public function edit(PostpartumVisit $postpartum)
    {

        // dd($postpartum);
        return Inertia::render('postpartum/action/postpartum-edit', [
            'postpartum' => new PostpartumVisitResource($postpartum),
            'page_prop' => [
                'enums' => [
                    'sleep_qualities' => SleepQualityEnum::options(),
                    'partner_supports' => PartnerSupportEnum::options(),
                    'familiy_economies' => FamilyEconomyEnum::options(),
                    'baby_caregivers' => BabyCaregiverEnum::options(),
                    'feed_types' => FeedTyperEnum::options()
                ]
            ]
        ]);
    }


    public function update(PostpartumVisitUpdateRequestValidator $request, PostpartumVisit $postpartum)
    {
        try {
            $request->validated();

            $postpartumVisitReq = new PostpartumVisitUpdateAttributeRequest();

            $postpartumVisitReq->visit_number = (int) $request->post('visit_number');

            $postpartumVisitReq->date_filled = (string) $request->post('date_filled');

            $postpartumVisitReq->sleep_quality   = (string) $request->post('sleep_quality');
            $postpartumVisitReq->partner_support = (string) $request->post('partner_support');
            $postpartumVisitReq->family_economy  = (string) $request->post('family_economy');

            $postpartumVisitReq->live_with_partner = filter_var($request->post('live_with_partner'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_history     = filter_var($request->post('psych_history'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_treatment   = filter_var($request->post('psych_treatment'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_trauma      = filter_var($request->post('psych_trauma'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->preg_comp_history = filter_var($request->post('preg_comp_history'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->last_comp         = filter_var($request->post('last_comp'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->baby_healthy      = filter_var($request->post('baby_healthy'), FILTER_VALIDATE_BOOL);

            $postpartumVisitReq->parity_count = (string) $request->post('parity_count');

            $postpartumVisitReq->last_comp_note = $request->post('last_comp_note') !== null
                ? (string) $request->post('last_comp_note')
                : null;

            $postpartumVisitReq->baby_caregiver = (string) $request->post('baby_caregiver');

            $postpartumVisitReq->feed_type = (string) $request->post('feed_type');

            // dd($postpartumVisitReq);

            $this->postpartumVisitService->update($postpartumVisitReq, $postpartum->id);


            return redirect()->route('postpartum')->with('success', 'Postpartum Visit has been updated.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }
}
