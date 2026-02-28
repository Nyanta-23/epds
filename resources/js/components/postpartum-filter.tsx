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
import { Filter } from '@/types';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CalendarIcon, FilterX, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

type Preset = 'all' | 'week' | 'month' | 'year' | 'custom';
type RiskType = 'all' | 'normal' | 'low' | 'high';

const PRESET_OPTIONS: { value: Preset; label: string }[] = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'week', label: '7 Hari Terakhir' },
    { value: 'month', label: '1 Bulan Terakhir' },
    { value: 'year', label: '1 Tahun Terakhir' },
    { value: 'custom', label: 'Rentang Kustom' },
];

const RISK_OPTIONS: { value: RiskType; label: string }[] = [
    { value: 'all', label: 'Semua Risiko' },
    { value: 'normal', label: 'Normal (0–9)' },
    { value: 'low', label: 'Risiko Rendah (10–12)' },
    { value: 'high', label: 'Risiko Tinggi (≥13)' },
];

interface PostpartumFilterProps {
    filter: Filter;
}

export default function PostpartumFilter({ filter }: PostpartumFilterProps) {
    const { search, is_followed, filter_list } = filter;
    const { date_filter } = filter_list ?? {};

    const initialPreset = (filter.preset as Preset) ?? 'all';
    const initialRisk = (filter.risk as RiskType) ?? 'all';

    const [preset, setPreset] = useState<Preset>(initialPreset);
    const [risk, setRisk] = useState<RiskType>(initialRisk);
    const [calOpen, setCalOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (date_filter?.start_date && date_filter?.end_date) {
            return {
                from: new Date(date_filter.start_date),
                to: new Date(date_filter.end_date),
            };
        }
        return undefined;
    });

    /* ── Apply filter ──────────────────────────────────────────────── */
    const apply = (
        nextPreset: Preset = preset,
        nextRisk: RiskType = risk,
        nextRange: DateRange | undefined = dateRange,
    ) => {
        const params: Record<string, any> = {
            preset: nextPreset,
            risk: nextRisk,
            search: search ?? undefined,
            is_followed: is_followed ?? undefined,
        };

        if (nextPreset === 'custom' && nextRange?.from && nextRange?.to) {
            params.start_date = format(nextRange.from, 'yyyy-MM-dd');
            params.end_date = format(nextRange.to, 'yyyy-MM-dd');
        } else {
            // Clear explicit dates when not using custom
            params.start_date = undefined;
            params.end_date = undefined;
        }

        router.get(route('postpartum'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    /* ── Reset ─────────────────────────────────────────────────────── */
    const reset = () => {
        setPreset('all');
        setRisk('all');
        setDateRange(undefined);
        router.get(
            route('postpartum'),
            {
                search: search ?? undefined,
                is_followed: is_followed ?? undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const isDefault = preset === 'all' && risk === 'all';

    /* ── Date label ────────────────────────────────────────────────── */
    const dateLabel = (() => {
        if (preset !== 'custom') return null;
        if (!dateRange?.from) return 'Pilih tanggal';
        if (!dateRange.to)
            return format(dateRange.from, 'd MMM yyyy', { locale: idLocale });
        return `${format(dateRange.from, 'd MMM yyyy', { locale: idLocale })} – ${format(dateRange.to, 'd MMM yyyy', { locale: idLocale })}`;
    })();

    /* ── Active range badge label ──────────────────────────────────── */
    const activeDateBadge = (() => {
        if (preset === 'custom' && dateRange?.from && dateRange?.to) {
            return `${format(dateRange.from, 'd MMM yyyy', { locale: idLocale })} – ${format(dateRange.to, 'd MMM yyyy', { locale: idLocale })}`;
        }
        if (preset === 'week') return '7 hari terakhir';
        if (preset === 'month') return '1 bulan terakhir';
        if (preset === 'year') return '1 tahun terakhir';
        return null;
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
                        const next = v as Preset;
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

            {/* ── Custom date range ───────────────────────────────────── */}
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
                        const next = v as RiskType;
                        setRisk(next);
                        apply(preset, next, dateRange);
                    }}
                >
                    <SelectTrigger className="h-8 w-44 cursor-pointer text-sm">
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

            {/* ── Active range badge + reset ──────────────────────────── */}
            <div className="ml-auto flex items-end gap-2">
                {activeDateBadge && (
                    <span className="hidden rounded-md bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary sm:inline-block">
                        {activeDateBadge}
                    </span>
                )}
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
