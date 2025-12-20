<?php

namespace App\Service\PostpartumVisit;

use App\Models\PostpartumVisit;
use Carbon\Carbon;

class PostpartumVisitExportService
{
  public function exportByDateRange(?string $start, ?string $end)
  {
    $query = PostpartumVisit::query()
      ->with(['mother', 'baby']);

    $query->when($start || $end, function ($q) use ($start, $end) {
      if ($start && $end) {
        $q->whereBetween('date_filled', [
          Carbon::parse($start)->startOfDay(),
          Carbon::parse($end)->endOfDay(),
        ]);
      } elseif ($start) {
        $q->where('date_filled', '>=', Carbon::parse($start)->startOfDay());
      } elseif ($end) {
        $q->where('date_filled', '<=', Carbon::parse($end)->endOfDay());
      }
    });



    return $query->orderBy('date_filled')->get()
      ->map(fn($item, $index) => [
        'No' => ($index + 1),
        'Ibu' => $item->mother?->name,

        'Anak Ke' => $item->baby?->which_child,
        'Kondisi Bayi' => $item->baby?->baby_condition->label_id(),
        'Tipe Melahirkan' => $item->baby?->typeof_delivery->label_id(),
        'Jenis Kelamin Bayi' => $item->baby?->gender == "male" ? "Laki Laki" : "Perempuan",

        'Jumlah Kunjungan' => $item->visit_number,
        'Waktu Di Isi' => $item->date_filled,

        'Kualitas Tidur' => $item->sleep_quality->label_id(),
        'Dukungan Pasangan' => $item->partner_support->label_id(),
        'Tinggal Dengan Pasangan' => $item->live_with_partner ? 'Ya' : 'Tidak',

        'Penghasilan Keluarga' => $item->family_salary_permonth->label_id(),
        'Jumlah Tanggungan' => $item->dependent_family_count->label_id(),
        'Kecukupan Gaji' => $item->is_salary_sufficient->label_id(),

        'Riwayat Psikologis' => $item->psych_history ? 'Ya' : 'Tidak',
        'Pengobatan Psikologis' => $item->psych_treatment ? 'Ya' : 'Tidak',
        'Trauma Psikologis' => $item->psych_trauma ? 'Ya' : 'Tidak',

        'Komplikasi Persalinan' => $item->last_comp ? 'Ya' : 'Tidak',
        'Catatan Komplikasi Persalinan' => $item->last_comp ? $item->last_comp_note : '-',
        'Komplikasi Saat Menggandung' => $item->preg_comp_history ? 'Ya' : 'Tidak',
        'Jumlah Mengandung' => $item->parity_count,

        'Bayi Sehat' => $item->baby_healthy ? 'Ya' : 'Tidak',
        'Pengasuh' => implode(', ', $item->baby_caregiver_label ?? []),
        'Jenis ASI' => $item->feed_type->label_id(),
      ]);
  }

  public function fileName(?string $start, ?string $end): string
  {
    if ($start && $end) {
      return "postpartum_visit_from_{$start}_to_{$end}.xlsx";
    } else if ($start) {
      return "postpartum_visit_from_{$start}.xlsx";
    } elseif ($end) {
      return "postpartum_visit_until_{$end}.xlsx";
    } else {
      return 'postpartum_visit.xlsx';
    }
  }
}
