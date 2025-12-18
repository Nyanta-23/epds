<?php

namespace App\Service\Dashboard;

use App\Models\PostpartumVisit;
use App\Models\Followup;

class DashboardService
{
    /**
     * Grafik Harian (7 Hari Terakhir)
     * Menggunakan Group By SQL agar cuma 1 query, bukan 7.
     */
    public function postpartumScreeningLineDay(): array
    {
        $startDate = now()->subDays(6)->startOfDay();
        $endDate = now()->endOfDay();

        $data = PostpartumVisit::selectRaw('DATE(date_filled) as date, count(*) as total')
            ->whereBetween('date_filled', [$startDate, $endDate])
            ->groupBy('date')
            ->pluck('total', 'date'); 

        $results = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateString = $date->toDateString();

            $results[] = [
                'day' => $date->format('l'),
                'date' => $dateString,
                'total' => $data[$dateString] ?? 0
            ];
        }

        return $results;
    }

    /**
     * Grafik Mingguan (4 Minggu Terakhir)
     */
    public function postpartumScreeningLineWeekly(): array
    {
        $results = [];
        for ($i = 3; $i >= 0; $i--) {
            $weekDate = now()->subWeeks($i);
            $start = $weekDate->copy()->startOfWeek();
            $end = $weekDate->copy()->endOfWeek();

            $count = PostpartumVisit::whereBetween('date_filled', [
                $start->toDateString(), 
                $end->toDateString()
            ])->count();

            $results[] = [
                'week' => "Week " . (4 - $i),
                'start' => $start->toDateString(),
                'end' => $end->toDateString(),
                'total' => $count
            ];
        }

        return $results;
    }

    /**
     * Grafik Bulanan (12 Bulan Terakhir)
     * Menggunakan SQL Group By Year-Month
     */
    public function postpartumScreeningLineMonth(): array
    {
        $startDate = now()->subMonths(11)->startOfMonth();
        
        $data = PostpartumVisit::selectRaw('YEAR(date_filled) as year, MONTH(date_filled) as month, count(*) as total')
            ->where('date_filled', '>=', $startDate)
            ->groupBy('year', 'month')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT) => $item->total];
            });

        $results = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $key = $date->format('Y-m');

            $results[] = [
                'month' => $date->format('F'),
                'year' => $date->year,
                'total' => $data[$key] ?? 0
            ];
        }

        return $results;
    }

    /**
     * Statistik Follow Up (Persentase)
     */
    public function followUpStats(): array
    {
        $totalVisits = PostpartumVisit::count();
      
        $totalFollowUp = Followup::count();

        if ($totalVisits === 0) {
            return [
                'follow_up_percentage' => 0,
                'unfollow_up_percentage' => 0,
                'total_visits' => 0
            ];
        }

        $percentageFollowUp = ($totalFollowUp / $totalVisits) * 100;
        $percentageUnFollowUp = 100 - $percentageFollowUp;

        return [
            'follow_up' => [
                'label' => 'Sudah Follow Up',
                'data' => round($percentageFollowUp),
                'count' => $totalFollowUp
            ],
            'unfollow_up' => [
                'label' => 'Belum Follow Up',
                'data' => round($percentageUnFollowUp),
                'count' => $totalVisits - $totalFollowUp
            ]
        ];
    }

    /**
     * Distribusi Risiko Minggu Ini
     */
    public function riskDistribution(): array
    {
        $visits = PostpartumVisit::with('result:id,postpartum_visit_id,total_score')
            ->whereBetween('date_filled', [
                now()->startOfWeek()->toDateString(),
                now()->endOfWeek()->toDateString(),
            ])
            ->get();

        $stats = [
            'Normal' => 0,
            'Low Risk' => 0,
            'High Risk' => 0,
        ];

        foreach ($visits as $visit) {
            if (!$visit->result) continue;

            $category = category_score($visit->result->total_score);

            if (isset($stats[$category])) {
                $stats[$category]++;
            } else {
                $stats['High Risk']++; 
            }
        }

        return [
            ['label' => 'Normal', 'value' => $stats['Normal'] ?? 0],
            ['label' => 'Low Risk', 'value' => $stats['Low Risk'] ?? 0],
            ['label' => 'High Risk', 'value' => $stats['High Risk'] ?? 0],
        ];
    }

    /**
     * Data Terbaru
     */
    public function latestPostpartumData(): array
    {
        $visits = PostpartumVisit::with(['mother', 'result'])
            ->latest('created_at')
            ->take(6)
            ->get();

        return $visits->map(function ($visit) {
            return [
                'number_patient' => $visit->mother?->number_patient ?? '-',
                'name' => $visit->mother?->name ?? 'Unknown',
                'date_filled' => $visit->date_filled,
                'risk' => $visit->result
                    ? category_score($visit->result->total_score)
                    : 'No Result',
            ];
        })->toArray();
    }
}