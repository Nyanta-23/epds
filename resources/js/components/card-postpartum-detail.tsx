import { Baby, PostpartumVisit } from '@/types/resource';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import marriedStatus from './utils/married_status';

interface CardPostpartumDetailProps {
    postpartum: PostpartumVisit;
    baby: Baby;
}

function InfoBlock({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </p>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
}

function InfoBadgeBlock({ label, value, isGood, isNeutral, isDanger }: { label: string, value: string, isGood?: boolean, isNeutral?: boolean, isDanger?: boolean }) {
    let variantClass = "bg-muted text-foreground border-none";
    if (isGood) variantClass = "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50 shadow-sm";
    if (isDanger) variantClass = "bg-destructive/10 text-destructive border-transparent shadow-sm";

    return (
        <div className="space-y-1.5 flex flex-col items-start w-full">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </p>
            <Badge className={`px-2.5 py-1 whitespace-normal break-words text-left max-w-full h-auto rounded-md font-medium ${variantClass}`} variant="outline">
                {value}
            </Badge>
        </div>
    );
}

function DangerBadgeBlock({ label, hasRisk, valueOverride, note }: { label: string, hasRisk: boolean, valueOverride?: string, note?: string | null }) {
    const variantClass = hasRisk 
        ? "bg-destructive/10 text-destructive border-none shadow-sm font-semibold" 
        : "bg-muted text-muted-foreground border-none font-medium";

    const value = valueOverride || (hasRisk ? 'Ya' : 'Tidak');

    return (
         <div className="space-y-1.5 flex flex-col items-start w-full">
            <div className={`flex w-full justify-between flex-col px-3 py-1.5 rounded-md ${hasRisk ? 'bg-destructive/5 border border-destructive/10' : 'border border-border'}`}>
                <span className={`text-sm ${hasRisk ? 'text-destructive font-medium' : 'text-foreground font-medium'}`}>
                    {label}
                </span>
                <Badge className={`rounded-md ${variantClass}`} variant="outline">
                    {value}
                </Badge>
            </div>
            {hasRisk && note && (
                <p className="text-xs text-destructive italic mt-1 ml-1">Catatan : {note}</p>
            )}
        </div>
    );
}

export default function CardPostpartumDetail({
    baby,
    postpartum,
}: CardPostpartumDetailProps) {
    return (
        <div className="space-y-6">
            
            {/* CARD 3 - Identitas Pasien */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3 px-6 pt-6 border-b ">
                    <CardTitle className="text-base font-semibold">
                        Identitas Pasien
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-5">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-y-6 gap-x-8">
                        <InfoBlock label="Nama" value={postpartum.mother?.name || '-'} />
                        <InfoBlock label="Status" value={marriedStatus(postpartum.mother?.married_status ?? '')} />
                        <InfoBlock label="Pekerjaan" value={postpartum.mother?.job || '-'} />
                        <InfoBlock label="Pendidikan" value={postpartum.mother?.highest_education || '-'} />
                        <InfoBlock label="Tempat, Tgl Lahir" value={`${postpartum.mother?.birthplace}, ${postpartum.mother?.date_of_birth}`} />
                    </div>
                </CardContent>
            </Card>

            {/* CARD 4 - Kondisi Sosial & Dukungan */}
            <Card className=" shadow-sm">
                <CardHeader className="pb-3 px-6 pt-6 border-b ">
                    <CardTitle className="text-base font-semibold">
                        Kondisi Sosial & Dukungan
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-5">
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-6 gap-x-6">
                        <InfoBadgeBlock 
                            label="Kualitas Tidur" 
                            value={postpartum.sleep_quality.label_id} 
                            isGood={['Baik', 'Cukup'].includes(postpartum.sleep_quality.label_id)}
                        />
                        <InfoBadgeBlock 
                            label="Dukungan Suami" 
                            value={postpartum.partner_support.label_id} 
                            isGood={postpartum.partner_support.label_id !== 'Kurang'}
                        />
                        <InfoBadgeBlock 
                            label="Tinggal Bersama" 
                            value={postpartum.live_with_partner ? 'Ya' : 'Tidak'} 
                            isGood={postpartum.live_with_partner}
                        />
                        <InfoBadgeBlock 
                            label="Pendapatan/Bulan" 
                            value={postpartum.family_salary_permonth.label_id} 
                        />
                        <InfoBadgeBlock 
                            label="Apakah Pendapatan Cukup" 
                            value={postpartum.is_salary_sufficient.label_id} 
                            isGood={postpartum.is_salary_sufficient.label_id === 'Cukup'}
                        />
                        <InfoBadgeBlock 
                            label="Tanggungan" 
                            value={`${postpartum.dependent_family_count.label_id} Orang`} 
                        />
                    </div>
                </CardContent>
            </Card>

            {/* CARD 5 - Riwayat Risiko Medis */}
            <Card className=" shadow-sm">
                <CardHeader className="pb-3 px-6 pt-6 border-b ">
                    <CardTitle className="text-base font-semibold ">
                        Riwayat Risiko Medis
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
                        <DangerBadgeBlock label="Riwayat Mental Health" hasRisk={!!postpartum.psych_history} />
                        <DangerBadgeBlock label="Pernah Trauma" hasRisk={!!postpartum.psych_trauma} />
                        <DangerBadgeBlock label="Terapi Psikologi Lalu" hasRisk={!!postpartum.psych_treatment} />
                        <DangerBadgeBlock label="Merasa Tidak Aman di Rumah" hasRisk={postpartum.feel_unsafe?.value !== 0} valueOverride={postpartum.feel_unsafe?.label_id} />
                        <DangerBadgeBlock label="Riwayat Komplikasi" hasRisk={!!postpartum.preg_comp_history} />
                        <DangerBadgeBlock label="Kehamilan Direncanakan" hasRisk={postpartum.pregnancy_planned?.value !== 1} valueOverride={postpartum.pregnancy_planned?.label_id} />
                        <DangerBadgeBlock 
                            label="Komplikasi Persalinan Terakhir" 
                            hasRisk={!!postpartum.last_comp} 
                            note={postpartum.last_comp_note} 
                        />
                        <div className="flex items-center">
                            <InfoBlock label="Jumlah Persalinan" value={`${postpartum.parity_count}x`} />
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
