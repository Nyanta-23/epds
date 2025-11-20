<?php

namespace App\Service\RecomendationVariation;

use App\Models\RecomendationVariation;

class RecomendationVariationService
{
  public function index()
  {
    $query = RecomendationVariation::latest();

    return $query->paginate(100)->withQueryString();
  }
}
