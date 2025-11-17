<?php

namespace App\Http\Controllers;

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
}
