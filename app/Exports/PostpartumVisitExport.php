<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\{
    FromCollection,
    ShouldAutoSize,
    WithHeadings,
    WithStyles,
};

class PostpartumVisitExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    public function __construct(
        protected Collection $data
    ) {}

    public function collection(): Collection
    {
        return $this->data;
    }

    public function headings(): array
    {
        return [
            'No',
            'Ibu',

            'Anak Ke',
            'Kondisi Bayi',
            'Tipe Melahirkan',
            'Jenis Kelamin Bayi',

            'Jumlah Kunjungan',
            'Waktu Di Isi',

            'Kualitas Tidur',
            'Dukungan Pasangan',
            'Tinggal Dengan Pasangan',

            'Penghasilan Keluarga',
            'Jumlah Tanggungan',
            'Kecukupan Gaji',

            'Riwayat Psikologis',
            'Pengobatan Psikologis',
            'Trauma Psikologis',

            'Komplikasi Persalinan',
            'Catatan Komplikasi Persalinan',

            'Komplikasi Saat Menggandung',
            'Jumlah Mengandung',

            'Bayi Sehat',
            'Pengasuh',
            'Jenis ASI',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->freezePane('A2');

        $highestRow = $sheet->getHighestRow();

        $baseHeader = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'alignment' => [
                'horizontal' => 'center',
                'vertical' => 'center',
            ],
        ];

        $applyGroup = function ($range, $color) use ($sheet, $baseHeader) {
            $sheet->getStyle($range)->applyFromArray(array_merge($baseHeader, [
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => $color],
                ],
            ]));
        };

        $applyGroup('B1', '4F4F4F');
        $applyGroup('C1:F1', '34495E');
        $applyGroup('G1:H1', '2F80ED');
        $applyGroup('I1:K1', '27AE60');
        $applyGroup('L1:N1', 'F2994A');
        $applyGroup('O1:Q1', '9B51E0');
        $applyGroup('R1:U1', 'EB5757');
        $applyGroup('V1:X1', '56CCF2');

        $sheet->getStyle("A2:X{$highestRow}")
            ->getAlignment()
            ->setVertical('center');

        $sheet->getStyle("A2:A{$highestRow}")->getAlignment()->setHorizontal('center');
        $sheet->getStyle("G2:H{$highestRow}")->getAlignment()->setHorizontal('center');

        return [];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 15,
            'B' => 25,
            'C' => 25,

            'D' => 15,
            'E' => 20,

            'F' => 20,
            'G' => 25,
            'H' => 22,

            'I' => 25,
            'J' => 22,
            'K' => 25,

            'L' => 22,
            'M' => 25,
            'N' => 25,

            'O' => 25,
            'P' => 35,

            'Q' => 30,
            'R' => 20,

            'S' => 15,
            'T' => 35,
            'U' => 20,

            'V' => 25,
        ];
    }
}
