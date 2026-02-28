import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { addDays, format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CalendarIcon, FilterX, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

export interface DashboardFilters {
    preset: 'week' | 'month' | 'year' | 'custom';
    risk: 'all' | 'normal' | 'low' | 'high';
    date_from: string;
    date_to: string;
}

interface DashboardFilterProps {
    filters: DashboardFilters;
}

const PRESET_OPTIONS = [
    { value: 'week', label: '7 Hari Terakhir' },
    { value: 'month', label: '1 Bulan Terakhir' },
    { value: 'year', label: '1 Tahun Terakhir' },
    { value: 'custom', label: 'Rentang Kustom' },
] as const;

const RISK_OPTIONS = [
    { value: 'all', label: 'Semua Risiko' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Risiko Rendah' },
    { value: 'high', label: 'Risiko Tinggi' },
] as const;

export default function DashboardFilter({ filters }: DashboardFilterProps) {
    const [preset, setPreset] = useState<DashboardFilters['preset']>(
        filters.preset,
    );
    const [risk, setRisk] = useState<DashboardFilters['risk']>(filters.risk);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(filters.date_from),
        to: new Date(filters.date_to),
    });
    const [calOpen, setCalOpen] = useState(false);

    /* ── Apply filter ──────────────────────────────────────────────── */
    const apply = (
        nextPreset: DashboardFilters['preset'] = preset,
        nextRisk: DashboardFilters['risk'] = risk,
        nextRange: DateRange | undefined = dateRange,
    ) => {
        const params: Record<string, string> = {
            preset: nextPreset,
            risk: nextRisk,
        };

        if (nextPreset === 'custom' && nextRange?.from && nextRange?.to) {
            params.date_from = format(nextRange.from, 'yyyy-MM-dd');
            params.date_to = format(nextRange.to, 'yyyy-MM-dd');
        }

        router.get(route('dashboard'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    /* ── Reset ─────────────────────────────────────────────────────── */
    const reset = () => {
        const def: DateRange = {
            from: addDays(new Date(), -7),
            to: new Date(),
        };
        setPreset('week');
        setRisk('all');
        setDateRange(def);
        router.get(
            route('dashboard'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const isDefault = preset === 'week' && risk === 'all';

    /* ── Date range label ──────────────────────────────────────────── */
    const dateLabel = (() => {
        if (preset !== 'custom') return null;
        if (!dateRange?.from) return 'Pilih tanggal';
        if (!dateRange.to)
            return format(dateRange.from, 'd MMM yyyy', { locale: idLocale });
        return `${format(dateRange.from, 'd MMM yyyy', { locale: idLocale })} – ${format(dateRange.to, 'd MMM yyyy', { locale: idLocale })}`;
    })();

    return (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm">
            {/* Label */}
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <SlidersHorizontal size={14} />
                <span>Filter</span>
            </div>

            <Separator orientation="vertical" className="hidden h-7 md:block" />

            {/* ── Preset ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-1">
                <Label className="text-[10px] font-semibold tracking-wide text-muted-foreground/70 uppercase">
                    Rentang Waktu
                </Label>
                <Select
                    value={preset}
                    onValueChange={(v) => {
                        const next = v as DashboardFilters['preset'];
                        setPreset(next);
                        if (next !== 'custom') apply(next, risk, dateRange);
                    }}
                >
                    <SelectTrigger className="h-8 w-44 cursor-pointer text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {PRESET_OPTIONS.map((o) => (
                            <SelectItem
                                key={o.value}
                                value={o.value}
                                className="cursor-pointer text-sm"
                            >
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* ── Custom date range (only when preset=custom) ─────────── */}
            {preset === 'custom' && (
                <div className="flex flex-col gap-1">
                    <Label className="text-[10px] font-semibold tracking-wide text-muted-foreground/70 uppercase">
                        Rentang Tanggal
                    </Label>
                    <Popover open={calOpen} onOpenChange={setCalOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    'h-8 w-[240px] justify-start gap-2 text-sm font-normal',
                                    !dateRange?.from && 'text-muted-foreground',
                                )}
                            >
                                <CalendarIcon
                                    size={13}
                                    className="shrink-0 text-muted-foreground"
                                />
                                {dateLabel ?? 'Pilih tanggal'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={(range) => {
                                    setDateRange(range);
                                    // Auto-apply when both ends are selected
                                    if (range?.from && range?.to) {
                                        setCalOpen(false);
                                        apply('custom', risk, range);
                                    }
                                }}
                                numberOfMonths={2}
                                disabled={{ after: new Date() }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            {/* ── Risk type ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-1">
                <Label className="text-[10px] font-semibold tracking-wide text-muted-foreground/70 uppercase">
                    Tipe Risiko
                </Label>
                <Select
                    value={risk}
                    onValueChange={(v) => {
                        const next = v as DashboardFilters['risk'];
                        setRisk(next);
                        apply(preset, next, dateRange);
                    }}
                >
                    <SelectTrigger className="h-8 w-40 cursor-pointer text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {RISK_OPTIONS.map((o) => (
                            <SelectItem
                                key={o.value}
                                value={o.value}
                                className="cursor-pointer text-sm"
                            >
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* ── Active range label ──────────────────────────────────── */}
            <div className="ml-auto flex items-end gap-2">
                <span className="hidden rounded-md bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary sm:inline-block">
                    {format(new Date(filters.date_from), 'd MMM yyyy', {
                        locale: idLocale,
                    })}
                    {' – '}
                    {format(new Date(filters.date_to), 'd MMM yyyy', {
                        locale: idLocale,
                    })}
                </span>

                {/* Reset button — only when not default */}
                {!isDefault && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
                        onClick={reset}
                    >
                        <FilterX size={13} />
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
