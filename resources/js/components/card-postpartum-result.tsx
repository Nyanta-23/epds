import { PostpartumVisit } from '@/types/resource';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CardPostpartumResultProps {
    postpartum: PostpartumVisit;
}

export default function CardPostpartumResult({
    postpartum,
}: CardPostpartumResultProps) {
    const score = postpartum.result?.total_score ?? null;
    let colorClass = 'text-gray-400';
    let label = 'Belum Ada Hasil';
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    let ringColor = 'stroke-muted/30';

    if (score !== null) {
        if (score <= 9) {
            colorClass = 'text-emerald-600';
            label = 'Normal / Risiko Rendah';
            badgeVariant = 'default';
            ringColor = 'stroke-emerald-500';
        } else if (score <= 12) {
            colorClass = 'text-amber-600';
            label = 'Risiko Postpartum Blues';
            badgeVariant = 'secondary';
            ringColor = 'stroke-amber-500';
        } else {
            colorClass = 'text-red-600';
            label = 'Risiko Depresi Postpartum';
            badgeVariant = 'destructive';
            ringColor = 'stroke-red-500';
        }
    }

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    // For visual effect, let's just make it a full ring or a 3/4 ring depending on score
    // Max score is 30.
    const progress = score !== null ? (score / 30) * circumference : 0;
    const strokeDashoffset = score !== null ? circumference - progress : circumference;

    return (
        <Card className="p-4 md:p-6 shadow-sm flex flex-col h-[22.8rem]">
            <CardHeader className="pb-0 px-0 pt-0 text-center">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                    Hasil Deteksi Dini
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 flex flex-col items-center justify-center flex-1 space-y-5">
                
                {/* Score Ring Gauge */}
                <div className="relative flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted/10"
                        />
                        <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className={`transition-all duration-1000 ease-out ${ringColor}`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold tracking-tight ">
                            {score ?? '-'}
                        </span>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <Badge variant={badgeVariant} className={`px-3 py-1 text-xs shadow-sm bg-opacity-10 dark:bg-opacity-20 ${colorClass}`}>
                        {label}
                    </Badge>
                    <p className="text-xs text-muted-foreground font-medium">
                        Kunjungan ke-{postpartum.visit_number} &middot; {postpartum.date_filled}
                    </p>
                </div>

            </CardContent>
        </Card>
    );
}
