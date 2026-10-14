<?php

namespace App\Service\Recapitulation;

use App\DTO\Response\Facility\Facility as FacilityDTO;
use App\Models\Facility;
use App\Models\PostpartumVisit;
use App\Models\Scopes\FacilityAccessScope;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class RecapitulationService
{
    public function __construct(private Facility $facilityModel, private PostpartumVisit $postpartumModel) {}

    public function getFacilities(?string $facilityId, ?string $userRole)
    {
        $query = $this->facilityModel
            ->with(['facilityType', 'province', 'regency', 'district', 'village']);

        if ($facilityId && $userRole === 'midwife') {
            $query->where(function ($q) use ($facilityId) {
                $q->where('id', $facilityId)
                    ->orWhere('parent_id', $facilityId);
            });
        }

        $facilitiesCollection = $query->get();

        $rootParentId = ($userRole === 'midwife' && $facilityId)
            ? $facilitiesCollection->firstWhere('id', $facilityId)?->parent_id
            : null;

        $grouped = $facilitiesCollection->groupBy('parent_id');

        return $this->buildTree($grouped, $rootParentId);
    }

    private function buildTree($groupedFacilities, $parentId)
    {
        $items = $groupedFacilities->get($parentId, collect());

        return $items->map(function ($facility) use ($groupedFacilities) {
            $addressParts = array_filter([
                $facility->province->name ?? null,
                $facility->regency->name ?? null,
                $facility->district->name ?? null,
                $facility->village->name ?? null,
            ]);

            return new FacilityDTO(
                id: $facility->id,
                name: $facility->name,
                facility_type: $facility->facilityType->name ?? '',
                address: implode(', ', $addressParts),
                children: $this->buildTree($groupedFacilities, $facility->id)
            );
        })->all();
    }

    public function recaps(string $facilityId, ?Carbon $from = null, ?Carbon $to = null): array
    {
        $baseQuery = $this->postpartumModel->newQuery()
            ->withoutGlobalScope(FacilityAccessScope::class)
            ->where('postpartum_visits.facility_id', $facilityId);

        if ($from && $to) {
            $baseQuery->whereBetween('postpartum_visits.date_filled', [$from, $to]);
        }

        $normalScore = $this->getRecapsNormalScore($baseQuery);
        $lowRiskScore = $this->getRecapsLowRiskScore($baseQuery);
        $highRiskScore = $this->getRecapsHighRiskScore($baseQuery);
        $getHighRiskInterventionRatio = $this->getHighRiskInterventionRatio($baseQuery);
        $getVolumeCoverageMatrix = $this->getVolumeCoverageMetrics($baseQuery);

        return [
            'normalScoreCount' => $normalScore,
            'lowRiskScoreCount' => $lowRiskScore,
            'highRiskScoreCount' => $highRiskScore,
            'highRiskInterventionRatio' => $getHighRiskInterventionRatio,
            'volumeCoverageMatrix' => $getVolumeCoverageMatrix,
        ];
    }

    private function getRecapsNormalScore(Builder $baseQuery): int
    {
        return (clone $baseQuery)->whereHas('results', function ($query) {
            $query->where('total_score', '<=', 9);
        })->count();
    }

    private function getRecapsLowRiskScore(Builder $baseQuery): int
    {
        return (clone $baseQuery)->whereHas('results', function ($query) {
            $query->whereBetween('total_score', [10, 12]);
        })->count();
    }

    private function getRecapsHighRiskScore(Builder $baseQuery): int
    {
        return (clone $baseQuery)->whereHas('results', function ($query) {
            $query->where('total_score', '>=', 13);
        })->count();
    }

    private function getHighRiskInterventionRatio(Builder $baseQuery): float
    {
        $highRiskCount = $this->getRecapsHighRiskScore($baseQuery);

        if ($highRiskCount === 0) {
            return 0.0;
        }

        $intervenedHighRiskCount = (clone $baseQuery)
            ->whereHas('results', function ($query) {
                $query->where('total_score', '>=', 13);
            })
            ->whereHas('followup')
            ->count();

        return round(($intervenedHighRiskCount / $highRiskCount) * 100, 2);
    }

    private function getVolumeCoverageMetrics(Builder $baseQuery): array
    {
        $totalTarget = (clone $baseQuery)->count();
        $totalScreened = (clone $baseQuery)->whereHas('results')->count();

        $coveragePercentage = 0.0;
        if ($totalTarget > 0) {
            $coveragePercentage = round(($totalScreened / $totalTarget) * 100, 2);
        }

        return [
            'total_target' => $totalTarget,
            'total_screened' => $totalScreened,
            'coverage_percentage' => $coveragePercentage,
        ];
    }

    public function getFacilityDetail(string $facilityId): array
    {
        $facility = $this->facilityModel->with(['facilityType', 'province', 'regency', 'district', 'village'])
            ->findOrFail($facilityId);

        $addressParts = array_filter([
            $facility->village?->name,
            $facility->district?->name,
            $facility->regency?->name,
            $facility->province?->name,
        ]);

        return [
            'id' => $facility->id,
            'name' => $facility->name,
            'facility_type' => $facility->facilityType?->name ?? 'Fasilitas Kesehatan',
            'address' => implode(', ', $addressParts) ?: '-',
        ];
    }

    public function getFacilityVisits(string $facilityId, ?Carbon $from = null, ?Carbon $to = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = $this->postpartumModel->newQuery()
            ->withoutGlobalScope(FacilityAccessScope::class)
            ->with(['result', 'followup'])
            ->where('postpartum_visits.facility_id', $facilityId);

        if ($from && $to) {
            $query->whereBetween('postpartum_visits.date_filled', [$from, $to]);
        }

        return $query->latest('date_filled')->paginate($perPage)->through(function ($visit) {
            $maskedPatientId = 'PSN-'.strtoupper(substr(md5((string) $visit->mother_id), 0, 6));

            $score = $visit->result?->total_score;
            $riskCategory = $score !== null ? category_score($score) : 'Belum Ada Skor';

            return [
                'id' => $visit->id,
                'anonymous_patient_id' => $maskedPatientId,
                'visit_number' => $visit->visit_number,
                'date_filled' => $visit->date_filled ? Carbon::parse($visit->date_filled)->format('d M Y') : '-',
                'score' => $score !== null ? (int) $score : '-',
                'risk_category' => $riskCategory,
                'followup' => $visit->followup ? [
                    'has_followup' => true,
                    'type' => $visit->followup->type?->label_id() ?? 'Tindak Lanjut',
                    'date_filled' => $visit->followup->date_filled ? Carbon::parse($visit->followup->date_filled)->format('d M Y') : '-',
                    'notes' => $visit->followup->notes ?: '-',
                ] : [
                    'has_followup' => false,
                    'type' => 'Belum Ditangani',
                    'date_filled' => '-',
                    'notes' => '-',
                ],
            ];
        });
    }
}
