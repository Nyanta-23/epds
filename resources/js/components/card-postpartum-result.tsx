import { PostpartumVisit } from '@/types/resource';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CardPostpartumResultProps {
    postpartum: PostpartumVisit;
}

export default function CardPostpartumResult({
    postpartum,
}: CardPostpartumResultProps) {
    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-lg">Hasil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div>
                    <p className="font-medium">Total Skor</p>
                    <p className="text-muted-foreground">
                        {postpartum.result?.total_score ?? '-'}
                    </p>
                </div>

                <div>
                    <p className="font-medium">Status Tindak Lanjut</p>
                    <Badge>
                        {postpartum.result?.followup_status.label_id ?? '-'}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
