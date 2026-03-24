import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CardRencanaTindakanProps {
    totalScore: number | null | undefined;
}

type ScoreCategory = {
    label: string;
    interpretasi: string;
    color: string;
    badgeVariant: 'default' | 'secondary' | 'destructive';
    icon: React.ReactNode;
    tindakan: (string | { text: string; sub: string[] })[];
    tindakLanjut: string[];
};

function getCategory(score: number): ScoreCategory {
    if (score <= 9) {
        return {
            label: 'Normal / Risiko Rendah',
            interpretasi: 'Kondisi psikologis ibu dalam batas normal.',
            color: 'bg-emerald-50 border-emerald-200',
            badgeVariant: 'default',
            icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
            tindakan: [
                'Memberikan dukungan emosional pada ibu.',
                'Memberikan edukasi tentang perubahan emosional masa nifas dan tanda-tanda awal perubahan suasana hati.',
                'Mendorong suami atau keluarga untuk memberikan dukungan pada ibu.',
            ],
            tindakLanjut: [
                'Melakukan skrining pada kunjungan nifas berikutnya.',
            ],
        };
    }

    if (score <= 12) {
        return {
            label: 'Risiko Postpartum Blues / Depresi Ringan',
            interpretasi:
                'Ibu mulai menunjukkan gejala kesedihan, cemas, atau kelelahan emosional.',
            color: 'bg-amber-50 border-amber-200',
            badgeVariant: 'secondary',
            icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
            tindakan: [
                'Memberikan dukungan emosional pada ibu; apa yang dirasakan oleh ibu adalah sesuatu yang normal.',
                'Melakukan konseling terkait kondisi emosional pada ibu, suami dan keluarga.',
                'Melakukan identifikasi faktor risiko.',
                'Memberikan edukasi coping stress dan manajemen emosi.',
                'Melibatkan suami dan keluarga dalam dukungan psikososial.',
            ],
            tindakLanjut: [
                'Lakukan pemantauan ulang dalam kunjungan berikutnya.',
                'Jika skor meningkat, pertimbangkan untuk melakukan rujukan.',
            ],
        };
    }

    // score >= 13
    return {
        label: 'Risiko Depresi Postpartum',
        interpretasi: 'Gejala depresi cukup signifikan.',
        color: 'bg-red-50 border-red-200',
        badgeVariant: 'destructive',
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        tindakan: [
            {
                text: 'Melakukan klarifikasi terkait kondisi psikologis ibu.',
                sub: [
                    'Tanyakan kembali jawaban yang menunjukkan skor tinggi untuk memastikan kondisi ibu.',
                ],
            },
            'Memberikan dukungan psikologis awal.',
            'Menilai dampak kondisi emosional ibu terhadap aktivitas sehari-hari.',
            'Jika pertanyaan nomor 10 EPDS terdapat skor, tanyakan hati-hati pada ibu apakah pernah memiliki pikiran untuk menyakiti diri sendiri.',
            'Menjelaskan kondisi pada suami dan keluarga agar tetap mendukung ibu.',
            'Melakukan rujukan ke tenaga kesehatan yang lebih kompeten.',
        ],
        tindakLanjut: [
            'Monitoring kondisi ibu setelah rujukan.',
            'Kolaborasi dengan tenaga kesehatan lain.',
        ],
    };
}

export default function CardRencanaTindakan({ totalScore }: CardRencanaTindakanProps) {
    if (totalScore === null || totalScore === undefined) {
        return null;
    }

    const category = getCategory(totalScore);

    return (
        <Card className={`border px-4`}>
            <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-base">
                    {category.icon}
                    Rencana Tindakan Bidan
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
                {/* Kategori & interpretasi */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Kategori:</span>
                        <Badge variant={category.badgeVariant} className="text-xs">
                            {category.label}
                        </Badge>
                    </div>
                    <p className="italic">{category.interpretasi}</p>
                </div>

                {/* Tindakan */}
                <div>
                    <p className="mb-2 font-semibold">Tindakan:</p>
                    <ol className="space-y-1 list-none">
                        {category.tindakan.map((item, idx) =>
                            typeof item === 'string' ? (
                                <li key={idx} className="flex gap-2 ">
                                    <span className="shrink-0 font-medium ">
                                        {idx + 1}.
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ) : (
                                <li key={idx} className="">
                                    <div className="flex gap-2">
                                        <span className="shrink-0 font-medium ">
                                            {idx + 1}.
                                        </span>
                                        <span>{item.text}</span>
                                    </div>
                                    <ul className="mt-1 ml-6 space-y-0.5 list-none">
                                        {item.sub.map((s, sIdx) => (
                                            <li key={sIdx} className="flex gap-2">
                                                <span className="shrink-0">a.</span>
                                                <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ),
                        )}
                    </ol>
                </div>

                {/* Tindak Lanjut */}
                <div className="rounded-md border border-dashed border-current/30 p-3">
                    <p className="mb-2 font-semibold">Tindak Lanjut:</p>
                    <ol className="space-y-1 list-none">
                        {category.tindakLanjut.map((item, idx) => (
                            <li key={idx} className="flex gap-2">
                                <span className="shrink-0 font-medium ">
                                    {idx + 1}.
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
}
