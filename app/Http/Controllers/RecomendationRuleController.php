<?php

namespace App\Http\Controllers;

use App\DTO\Request\RecomendationRule\RecomendationRuleStoreAttributeRequest;
use App\DTO\Request\RecomendationRule\RecomendationRuleUpdateAttributeRequest;
use App\Http\Requests\RecomendationRule\RecomendationRuleStoreRequestValidator;
use App\Http\Requests\RecomendationRule\RecomendationRuleUpdateRequestValidator;
use App\Http\Resources\RecomendationRuleResource;
use App\Models\RecomendationRule;
use App\Service\RecomendationRule\RecomendationRuleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecomendationRuleController extends Controller
{

    public function __construct(
        private RecomendationRuleService $recomendationRuleService,
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            // 'only_trash' => $request->boolean('only_trash', false),
        ];

        $recomendationRules = $this->recomendationRuleService->index($filters);

        return Inertia::render('recomendation-rule', [
            'recomendation_rules' => RecomendationRuleResource::collection($recomendationRules),
            'page_prop' => [
                'filter' => $filters
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('recomendation/action/recomendation-rule-create');
    }

    public function edit(RecomendationRule $rule)
    {
        return Inertia::render('recomendation/action/recomendation-rule-edit', [
            'recomendation_rule' => new RecomendationRuleResource($rule)
        ]);
    }

    public function store(RecomendationRuleStoreRequestValidator $request)
    {
        try {

            $request->validated();

            $recomendationRuleReq = new RecomendationRuleStoreAttributeRequest();

            $recomendationRuleReq->name = $request->post('name');
            $recomendationRuleReq->description = $request->post('description');
            $recomendationRuleReq->min_score = $request->post('min_score');
            $recomendationRuleReq->max_score = $request->post('max_score');


            $this->recomendationRuleService->store($recomendationRuleReq);

            return redirect()->route('rule')->with('success', 'Recomendation Rule, has been created.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);
            return redirect()->back()->with('error', 'An internal server error.');
        }
    }

    public function update(RecomendationRuleUpdateRequestValidator $request, RecomendationRule $rule)
    { 
         try {

            $request->validated();

            $toneCategoryReq = new RecomendationRuleUpdateAttributeRequest();

            $toneCategoryReq->name = $request->post('name');
            $toneCategoryReq->description = $request->post('description');
            $toneCategoryReq->min_score = $request->post('min_score');
            $toneCategoryReq->max_score = $request->post('max_score');

            $this->toneCategoryService->update($toneCategoryReq, $rule->id);

            return redirect()->route('tone')->with('success', 'Recomendation Rule, has been updated.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);
            return redirect()->back()->with('error', 'An internal server error.');
        }

    }

    public function destroy(RecomendationRule $rule)
    {
        try {

            $this->recomendationRuleService->softDelete($rule->id);

            return redirect()->back()->with('success', 'Successfully deleting recomendation rule.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);
            return redirect()->back()->with('error', 'An internal server error.');
        }
    }
}
