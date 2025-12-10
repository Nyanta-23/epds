import { PostpartumVisit } from '@/types/resource';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface CardPostpartumDetailProps {
    postpartum: PostpartumVisit;
}

export default function CardPostpartumDetail({
    postpartum,
}: CardPostpartumDetailProps) {
    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Postpartum Detail
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="font-medium">Visit Number</p>
                        <p className="text-muted-foreground">
                            {postpartum.visit_number}
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">Date Filled</p>
                        <p className="text-muted-foreground">
                            {postpartum.date_filled}
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">Patient Number</p>
                        <p className="text-muted-foreground">
                            {postpartum.mother.id}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">Name</p>
                        <p className="text-muted-foreground">
                            {postpartum.mother.name}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">Place, Date of Birth</p>
                        <p className="text-muted-foreground">{`${postpartum.mother.birthplace}, ${postpartum.mother.date_of_birth}`}</p>
                    </div>
                    <div>
                        <p className="font-medium">Job</p>
                        <p className="text-muted-foreground">
                            {postpartum.mother.job}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">Married Status</p>
                        <p className="text-muted-foreground">
                            {postpartum.mother.married_status}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">Highest Education</p>
                        <p className="text-muted-foreground">
                            {postpartum.mother.highest_education}
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-center">
                    <div className="flex w-full justify-start">
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <p className="font-medium">Kualitas Tidur</p>
                                <Badge>
                                    {postpartum.sleep_quality.label_id}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">
                                    Apakah tinggal bersama pasangan
                                </p>
                                <Badge>
                                    {postpartum.live_with_partner
                                        ? 'Ya'
                                        : 'Tidak'}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">Dukungan Suami</p>
                                <Badge>
                                    {postpartum.partner_support.label_id}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">
                                    Pendapatan keluarga perbulan
                                </p>
                                <Badge>
                                    {postpartum.family_salary_permonth.label_id}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">
                                    Jumlah Keluarga yang ditanggung
                                </p>
                                <Badge>
                                    {postpartum.dependent_family_count.label_id}{' '}
                                    Orang
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Separator orientation="vertical" className="mx-4" />
                    </div>

                    <div className="flex w-full justify-start">
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <p className="font-medium">
                                    Apakah pendapatan cukup
                                </p>
                                <Badge>
                                    {postpartum.is_salary_sufficient.label_id}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">
                                    Mental Health History
                                </p>
                                <Badge>
                                    {postpartum.psych_history ? 'Ya' : 'Tidak'}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">Past Treatment</p>
                                <Badge>
                                    {postpartum.psych_treatment
                                        ? 'Ya'
                                        : 'Tidak'}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">Trauma History</p>
                                <Badge>
                                    {postpartum.psych_trauma ? 'Ya' : 'Tidak'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-center">
                    <div className="flex w-full justify-start">
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <p className="font-medium">
                                    Berapa kali melahirkan
                                </p>
                                <Badge>{postpartum.parity_count}</Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">
                                    Riwayat Komplikasi Kehamilan
                                </p>
                                <Badge>
                                    {postpartum.preg_comp_history
                                        ? 'Ya'
                                        : 'Tidak'}
                                </Badge>
                            </div>

                            <p className="font-medium">
                                Komplikasi Persalinan Terakhir
                            </p>
                            <Badge>
                                {postpartum.last_comp ? 'Ya' : 'Tidak'}
                            </Badge>
                            <div>
                                {postpartum.last_comp == 1 && (
                                    <p className="text-md mt-1 text-muted-foreground">
                                        Note: 
                                        {postpartum.last_comp_note ??
                                            'Tidak Ada'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Separator orientation="vertical" className="mx-4" />
                    </div>

                    <div className="flex w-full justify-start">
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <p className="font-medium">Kesehatan bayi</p>
                                <Badge>
                                    {postpartum.baby_healthy.label_id}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">Pengasuh Bayi</p>
                                <Badge>
                                    {postpartum.baby_caregiver.label.join(', ')}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">
                                    Tipe Pemberian Makan
                                </p>
                                <Badge>{postpartum.feed_type.label}</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
