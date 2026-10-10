<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FacilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'regency_id' => ['required', 'string', Rule::exists('regencies', 'id')],
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $facilities = Facility::query()
            ->where('is_deleted', false)
            ->where('regency_id', $validated['regency_id'])
            ->when($validated['search'] ?? null, function ($query, string $search): void {
                $query->where('name', 'like', "%{$search}%");
            })
            ->with('facilityType:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'facility_type_id'])
            ->map(fn (Facility $facility): array => [
                'id' => $facility->id,
                'name' => $facility->name,
                'facility_type' => $facility->facilityType?->name,
            ]);

        return response()->json(['data' => $facilities]);
    }
}
