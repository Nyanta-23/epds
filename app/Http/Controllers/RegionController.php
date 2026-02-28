<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class RegionController extends Controller
{
  private const BASE_URL = 'https://wilayah.id/api';

  public function provinces(): JsonResponse
  {
    $response = Http::get(self::BASE_URL . '/provinces.json');

    return response()->json($response->json());
  }

  public function regencies(string $provinceCode): JsonResponse
  {
    $response = Http::get(self::BASE_URL . "/regencies/{$provinceCode}.json");

    return response()->json($response->json());
  }

  public function districts(string $regencyCode): JsonResponse
  {
    $response = Http::get(self::BASE_URL . "/districts/{$regencyCode}.json");

    return response()->json($response->json());
  }

  public function villages(string $districtCode): JsonResponse
  {
    $response = Http::get(self::BASE_URL . "/villages/{$districtCode}.json");

    return response()->json($response->json());
  }
}
