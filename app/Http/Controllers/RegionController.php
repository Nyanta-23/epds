<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use App\Models\Village;
use Illuminate\Http\JsonResponse;

class RegionController extends Controller
{
    public function provinces(): JsonResponse
    {
        return response()->json([
            'data' => Province::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Province $province): array => [
                    'code' => $province->id,
                    'name' => $province->name,
                ]),
        ]);
    }

    public function regencies(string $provinceCode): JsonResponse
    {
        return response()->json([
            'data' => Regency::query()
                ->where('province_id', $provinceCode)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Regency $regency): array => [
                    'code' => $regency->id,
                    'name' => $regency->name,
                ]),
        ]);
    }

    public function districts(string $regencyCode): JsonResponse
    {
        return response()->json([
            'data' => District::query()
                ->where('regency_id', $regencyCode)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (District $district): array => [
                    'code' => $district->id,
                    'name' => $district->name,
                ]),
        ]);
    }

    public function villages(string $districtCode): JsonResponse
    {
        return response()->json([
            'data' => Village::query()
                ->where('district_id', $districtCode)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Village $village): array => [
                    'code' => $village->id,
                    'name' => $village->name,
                ]),
        ]);
    }
}
