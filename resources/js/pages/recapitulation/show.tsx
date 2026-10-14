import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableEmpty,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import {
    type FacilityRecapDetail,
    type PaginatedVisits,
    type RecapitulationFilter,
    type RecapitulationMetrics,
} from '@/types/resource';
import { Head, Link, router } from '@inertiajs/react';
import { addDays, format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Building2,
    CalendarIcon,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FilterX,
    Lock,
    MapPin,
    ScanHeart,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

interface ShowRecapitulationProps {
    facility: FacilityRecapDetail;
    recaps: RecapitulationMetrics;
    visits: PaginatedVisits;
    filters: RecapitulationFilter;
}

const PRESET_OPTIONS = [
    { value: 'all', label: 'Semua Waktu (Kumulatif)' },
    { value: 'week', label: '7 Hari Terakhir' },
    { value: 'month', label: '1 Bulan Terakhir' },
    { value: 'year', label: '1 Tahun Terakhir' },
    { value: 'custom', label: 'Rentang Kustom' },
] as const;

function RiskBadge({ risk }: { risk: string }) {
    const lower = risk.toLowerCase();

    if (lower.includes('high')) {
        return (
            <span
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
                    'text-[11px] font-semibold ring-1 ring-inset',
                    'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/30'
                )}
            >
                <span className="size-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                Risiko Tinggi
            </span>
        );
    }

    if (lower.includes('low')) {
        return (
            <span
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
                    'text-[11px] font-semibold ring-1 ring-inset',
                    'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/30'
                )}
            >
                <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                Risiko Rendah
            </span>
        );
    }

    if (lower.includes('normal')) {
        return (
            <span
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
                    'text-[11px] font-semibold ring-1 ring-inset',
                    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/30'
                )}
            >
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Normal
            </span>
        );
    }

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
                'text-[11px] font-semibold ring-1 ring-inset',
                'bg-muted text-muted-foreground ring-border'
            )}
        >
            <span className="size-1.5 rounded-full bg-muted-foreground/40" aria-hidden="true" />
            {risk}
        </span>
    );
}

function FollowupBadge({ hasFollowup, type }: { hasFollowup: boolean; type: string }) {
    if (!hasFollowup) {
        return (
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                Belum Ditangani
            </span>
        );
    }

    const lower = type.toLowerCase();
    if (lower.includes('rujuk')) {
        return (
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 ring-1 ring-inset ring-purple-200 dark:bg-purple-900/20 dark:text-purple-300">
                Rujukan
            </span>
        );
    }
    if (lower.includes('monitor')) {
        return (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
                Monitoring
            </span>
        );
    }
    return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300">
            {type}
        </span>
    );
}

export default function ShowRecapitulation({
    facility,
    recaps,
    visits,
    filters,
}: ShowRecapitulationProps) {
    const [preset, setPreset] = useState<RecapitulationFilter['preset']>(
        filters.preset || 'all'
    );
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (filters.date_from && filters.date_to) {
            return {
                from: new Date(filters.date_from),
                to: new Date(filters.date_to),
            };
        }
        return undefined;
    });
    const [calOpen, setCalOpen] = useState(false);

    const applyFilter = (
        nextPreset: RecapitulationFilter['preset'] = preset,
        nextRange: DateRange | undefined = dateRange
    ) => {
        const params: Record<string, string> = {
            preset: nextPreset,
        };

        if (nextPreset === 'custom' && nextRange?.from && nextRange?.to) {
            params.date_from = format(nextRange.from, 'yyyy-MM-dd');
            params.date_to = format(nextRange.to, 'yyyy-MM-dd');
        }

        router.get(route('recapitulation.show', facility.id), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilter = () => {
        setPreset('all');
        setDateRange(undefined);
        router.get(
            route('recapitulation.show', facility.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Rekapitulasi',
            href: route('recapitulation'),
        },
        {
            title: facility.name,
            href: route('recapitulation.show', facility.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rekapitulasi - ${facility.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 md:p-6">
                {/* ── Top Header & Facility Info ──────────────────────── */}
                <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link href={route('recapitulation')}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 cursor-pointer text-xs"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    Kembali
                                </Button>
                            </Link>
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                <Building2 className="h-3 w-3" />
                                {facility.facility_type}
                            </span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                            {facility.name}
                        </h1>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground md:text-sm">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                            <span>{facility.address}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-xs text-muted-foreground sm:self-auto">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Data pasien dalam rekapitulasi ini disamarkan demi privasi medis</span>
                    </div>
                </div>

                {/* ── Filter Bar ──────────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-card/60 p-3 shadow-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Periode:</span>
                        <Select
                            value={preset}
                            onValueChange={(val) => {
                                const p = val as RecapitulationFilter['preset'];
                                setPreset(p);
                                if (p !== 'custom') {
                                    applyFilter(p);
                                }
                            }}
                        >
                            <SelectTrigger className="h-8 w-44 text-xs">
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                {PRESET_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {preset === 'custom' && (
                        <Popover open={calOpen} onOpenChange={setCalOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        'h-8 text-xs font-normal gap-2',
                                        !dateRange?.from && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, 'dd MMM yyyy', {
                                                    locale: idLocale,
                                                })}{' '}
                                                –{' '}
                                                {format(dateRange.to, 'dd MMM yyyy', {
                                                    locale: idLocale,
                                                })}
                                            </>
                                        ) : (
                                            format(dateRange.from, 'dd MMM yyyy', {
                                                locale: idLocale,
                                            })
                                        )
                                    ) : (
                                        'Pilih rentang tanggal'
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={(range) => {
                                        setDateRange(range);
                                        if (range?.from && range?.to) {
                                            setCalOpen(false);
                                            applyFilter('custom', range);
                                        }
                                    }}
                                    numberOfMonths={2}
                                    locale={idLocale}
                                />
                            </PopoverContent>
                        </Popover>
                    )}

                    {preset !== 'all' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilter}
                            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <FilterX className="h-3.5 w-3.5" />
                            Reset Filter
                        </Button>
                    )}
                </div>

                {/* ── Dashboard Stats Cards ───────────────────────────── */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {/* Normal Score */}
                    <Card className="gap-2 p-4 border-border/60 shadow-xs transition-shadow hover:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <span className="text-xs font-medium text-muted-foreground">
                                Skor Normal (≤ 9)
                            </span>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {recaps.normalScoreCount}
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                Kunjungan tanpa indikasi depresi
                            </p>
                        </CardContent>
                    </Card>

                    {/* Low Risk */}
                    <Card className="gap-2 p-4 border-border/60 shadow-xs transition-shadow hover:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <span className="text-xs font-medium text-muted-foreground">
                                Risiko Rendah (10 - 12)
                            </span>
                            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                <AlertCircle className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {recaps.lowRiskScoreCount}
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                Butuh pemantauan berkala
                            </p>
                        </CardContent>
                    </Card>

                    {/* High Risk */}
                    <Card className="gap-2 p-4 border-border/60 shadow-xs transition-shadow hover:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <span className="text-xs font-medium text-muted-foreground">
                                Risiko Tinggi (≥ 13)
                            </span>
                            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {recaps.highRiskScoreCount}
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                Perlu evaluasi & rujukan medis
                            </p>
                        </CardContent>
                    </Card>

                    {/* Intervention Ratio */}
                    <Card className="gap-2 p-4 border-border/60 shadow-xs transition-shadow hover:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <span className="text-xs font-medium text-muted-foreground">
                                Rasio Intervensi
                            </span>
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                <Activity className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {recaps.highRiskInterventionRatio}%
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                Kasus risiko tinggi tertangani
                            </p>
                        </CardContent>
                    </Card>

                    {/* Screening Coverage */}
                    <Card className="gap-2 p-4 border-border/60 shadow-xs transition-shadow hover:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <span className="text-xs font-medium text-muted-foreground">
                                Cakupan Skrining
                            </span>
                            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
                                <ScanHeart className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {recaps.volumeCoverageMatrix.coverage_percentage}%
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                {recaps.volumeCoverageMatrix.total_screened} dari{' '}
                                {recaps.volumeCoverageMatrix.total_target} kunjungan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Confidential Visits Table ───────────────────────── */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold tracking-tight text-foreground">
                                Daftar Kunjungan & Skrining
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Seluruh informasi pribadi pasien dirahasiakan dan diganti dengan ID anonim demi kepatuhan etika medis.
                            </p>
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">
                            Total {visits.total} riwayat kunjungan
                        </div>
                    </div>

                    <TableContainer>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full text-sm">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-4 whitespace-nowrap">No</TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            ID Anonim Pasien
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Kunjungan
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Tanggal Pengisian
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Skor EPDS
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Kategori Risiko
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Status Penanganan
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Tgl Penanganan
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap pr-4">
                                            Catatan Penanganan
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visits.data.length === 0 ? (
                                        <TableEmpty
                                            colSpan={9}
                                            message="Belum ada riwayat kunjungan untuk fasilitas ini pada periode yang dipilih"
                                        />
                                    ) : (
                                        visits.data.map((visit, index) => {
                                            const rowNumber =
                                                ((visits.current_page || 1) - 1) *
                                                    (visits.per_page || 10) +
                                                index +
                                                1;

                                            return (
                                                <TableRow key={visit.id}>
                                                    <TableCell className="pl-4 font-medium whitespace-nowrap">
                                                        {rowNumber}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground">
                                                            <Lock className="h-3 w-3 text-muted-foreground" />
                                                            {visit.anonymous_patient_id}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="font-medium whitespace-nowrap">
                                                        Kunjungan {visit.visit_number}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                                        {visit.date_filled}
                                                    </TableCell>
                                                    <TableCell className="font-semibold whitespace-nowrap">
                                                        {visit.score}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <RiskBadge risk={visit.risk_category} />
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <FollowupBadge
                                                            hasFollowup={
                                                                visit.followup.has_followup
                                                            }
                                                            type={visit.followup.type}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                                        {visit.followup.date_filled}
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground pr-4" title={visit.followup.notes}>
                                                        {visit.followup.notes}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TableContainer>

                    {/* ── Pagination ──────────────────────────────────── */}
                    {visits.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border/50 pt-3">
                            <span className="text-xs text-muted-foreground">
                                Menampilkan {visits.from ?? 0}–{visits.to ?? 0} dari {visits.total} data
                            </span>
                            <div className="flex items-center gap-1">
                                {visits.links.map((link, idx) => {
                                    if (link.url === null) {
                                        return (
                                            <Button
                                                key={idx}
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                className="h-8 px-2.5 text-xs text-muted-foreground opacity-50"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                        >
                                            <Button
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                className="h-8 px-2.5 text-xs cursor-pointer"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
