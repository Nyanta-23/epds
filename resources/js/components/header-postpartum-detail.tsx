import { PostpartumVisit } from '@/types/resource';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface HeaderPostpartumDetailProps {
    postpartum: PostpartumVisit;
}

export default function HeaderPostpartumDetail({ postpartum }: HeaderPostpartumDetailProps) {
    const score = postpartum.result?.total_score ?? null;
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    let label = 'Belum Ada Hasil';
    let icon = null;
    let badgeBg = 'text-gray-800';

    if (score !== null) {
        if (score <= 9) {
            badgeVariant = 'default';
            label = 'Risiko Rendah';
            icon = <CheckCircle className="w-4 h-4 ml-1.5 opacity-80" />;
            badgeBg = 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none';
        } else if (score <= 12) {
            badgeVariant = 'secondary';
            label = 'Risiko Postpartum Blues';
            icon = <AlertTriangle className="w-4 h-4 ml-1.5 opacity-80" />;
            badgeBg = 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-none';
        } else {
            badgeVariant = 'destructive';
            label = 'Risiko Tinggi Depresi';
            icon = <XCircle className="w-4 h-4 ml-1.5 opacity-80" />;
            badgeBg = 'bg-red-100 text-red-800 hover:bg-red-100 border-none';
        }
    }

    return (
        <Card className="overflow-hidden border-none shadow-sm rounded-xl">
            {/* Top accent bar */}
            <div className="h-2 w-full bg-primary"></div>
            
            <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Pasien
                    </p>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                        {postpartum.mother?.name ?? 'Nama Pasien'}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium font-mono">
                        {postpartum.mother?.number_patient ?? 'P-XXX-XXX'}
                    </p>
                </div>

                {score !== null && (
                    <div className="self-end sm:self-auto">
                        <Badge variant={badgeVariant} className={`px-3 py-1.5 text-sm font-medium rounded-full shadow-sm flex items-center ${badgeBg}`}>
                            {label}
                            {icon}
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
