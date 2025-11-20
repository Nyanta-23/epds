<?php

namespace App\Http\Controllers;

use App\Http\Resources\RecomendationVariationResource;
use App\Service\RecomendationVariation\RecomendationVariationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecomendationVariationController extends Controller
{

    public function __construct(
        private RecomendationVariationService $recomendationVariationService,
    ) {}


    public function index(Request $request)
    {

        $filters = [

        ];

        $recomendationVariations =   $this->recomendationVariationService->index();

        return Inertia::render('recomendation-variation', [
            'recomendation_variations' => RecomendationVariationResource::collection($recomendationVariations),
            'page_prop' => $filters
        ]);
    }
}
