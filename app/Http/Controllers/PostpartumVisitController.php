<?php

namespace App\Http\Controllers;

use App\DTO\Request\PostpartumVisit\PostpartumVisitUpdateAttributeRequest;
use App\Enums\BabyCaregiverEnum;
use App\Enums\FamilyEconomyEnum;
use App\Enums\FeedTyperEnum;
use App\Enums\FollowUpStatusEnum;
use App\Enums\FollowUpTypeEnum;
use App\Enums\PartnerSupportEnum;
use App\Enums\SleepQualityEnum;
use App\Http\Requests\PostpartumVisit\PostpartumVisitUpdateRequestValidator;
use App\Http\Resources\BabyResource;
use App\Http\Resources\PatientResource;
use App\Http\Resources\PostpartumVisitResource;
use App\Models\Baby;
use App\Models\PostpartumVisit;
use App\Service\PostpartumVisit\PostpartumVisitExportService;
use App\Service\PostpartumVisit\PostpartumVisitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PostpartumVisitExport;


class PostpartumVisitController extends Controller
{

    public function __construct(
        private PostpartumVisitService $postpartumVisitService,
        private PostpartumVisitExportService $postpartumVisitExportService
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'only_trash' => $request->boolean('only_trash', false),
            'is_followed' => $request->boolean('is_followed', false),
            'filter_list' => [
                'date_filter' => [
                    'start_date' => $request->input('start_date'),
                    'end_date' => $request->input('end_date'),
                ],
                'select_filter' => [
                    'is_verified' => $request->input('is_verified'),
                    'is_can_visit' => $request->input('is_can_visit'),
                ],
            ]
        ];


        $postpartumVisits = $this->postpartumVisitService->index($filters);


        return Inertia::render('postpartum', [
            'postpartums' => PostpartumVisitResource::collection($postpartumVisits),
            'page_prop' => [
                'main_link' => '',
                'filter' => $filters,
                'enums' => [
                    'followup_types' => FollowUpTypeEnum::options(),
                    'followup_status' => FollowUpStatusEnum::options()
                ]
            ]
        ]);
    }

    public function show(PostpartumVisit $postpartum)
    {

        $postpartum->load([
            'mother',
            'result',
            'followup',
            'answers' => function ($query) {
                $query
                    ->join('questions', 'answers.question_id', '=', 'questions.id')
                    ->orderBy('questions.number_question', 'asc')
                    ->select('answers.*');
            },
            'answers.question.optionQuestions'
        ]);

        $baby = Baby::where('mother_id', $postpartum->mother_id)->orderBy('date_of_birth', 'desc')->first();

        return Inertia::render('postpartum/action/postpartum-show', [
            'postpartum' => new PostpartumVisitResource($postpartum),
            'baby' => new BabyResource($baby),
            'page_prop' => [
                'enums' => [
                    'followup_types' => FollowUpTypeEnum::options(),
                    'followup_status' => FollowUpStatusEnum::options()
                ]
            ],
        ]);
    }


    public function edit(PostpartumVisit $postpartum)
    {
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

            $postpartumVisitReq->sleep_quality = (string) $request->post('sleep_quality');
            $postpartumVisitReq->partner_support = (string) $request->post('partner_support');
            $postpartumVisitReq->family_economy = (string) $request->post('family_economy');

            $postpartumVisitReq->live_with_partner = filter_var($request->post('live_with_partner'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_history = filter_var($request->post('psych_history'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_treatment = filter_var($request->post('psych_treatment'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->psych_trauma = filter_var($request->post('psych_trauma'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->preg_comp_history = filter_var($request->post('preg_comp_history'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->last_comp = filter_var($request->post('last_comp'), FILTER_VALIDATE_BOOL);
            $postpartumVisitReq->baby_healthy = filter_var($request->post('baby_healthy'), FILTER_VALIDATE_BOOL);

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


    public function previousPostpartumVisit()
    {
        try {
            $thisIsMy = auth()->user();


            $hasPrevious = $this->postpartumVisitService->hasPrevious($thisIsMy);

            if ($hasPrevious) {
                $previousPostpartumVisit = $this->postpartumVisitService->previousDataFromUser($thisIsMy);
            } else {
                $previousPostpartumVisit = null;
            }

            return response()->json([
                'message' => 'Previous postpartum visit fetched successfully.',
                'data' => $previousPostpartumVisit
            ], 200);
        } catch (\Exception $err) {

            return response()->json([
                'message' => 'An error occurred.',
                'error' => $err->getMessage()
            ], 500);
        }
    }

    public function export(Request $request)
    {
        $start = $request->start_date;
        $end   = $request->end_date;

        $data = $this->postpartumVisitExportService
            ->exportByDateRange($start, $end);


        return Excel::download(
            new PostpartumVisitExport($data),
            $this->postpartumVisitExportService->fileName($start, $end)
        );
    }
}
