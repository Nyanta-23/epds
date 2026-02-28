import type { DashboardFilters } from '@/components/dashboard-filter';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { ShieldAlert } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';

/* ── Colour palette — maps to CSS vars defined by the theme ── */
const RISK_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

interface ChartPieRiskProps {
    risk_distributions: { label: string; value: number }[];
    filters?: DashboardFilters;
}

export const description = 'EPDS Risk Distribution Chart';

export default function ChartPieRisk({
    risk_distributions,
    filters,
}: ChartPieRiskProps) {
    const total = risk_distributions.reduce((s, i) => s + i.value, 0);

    const chartData = risk_distributions.map((item, index) => ({
        name: item.label,
        value: item.value,
        fill: RISK_COLORS[index % RISK_COLORS.length],
        pct: total > 0 ? Math.round((item.value / total) * 100) : 0,
    }));

    const chartConfig: ChartConfig = {
        value: { label: 'Pasien' },
        ...chartData.reduce((acc: any, item) => {
            acc[item.name] = { label: item.name, color: item.fill };
            return acc;
        }, {}),
    };

    const subtitle = filters
        ? `${format(new Date(filters.date_from), 'd MMM yyyy', { locale: idLocale })} – ${format(new Date(filters.date_to), 'd MMM yyyy', { locale: idLocale })}`
        : 'Hasil Skrining Minggu ini';

    const isEmpty = total === 0;

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                        <ShieldAlert className="size-4 text-primary" />
                    </span>
                    <div>
                        <CardTitle className="text-sm font-semibold">Distribusi Risiko</CardTitle>
                        <CardDescription className="text-xs">{subtitle}</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-center gap-4 px-4 pb-4">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
                        <ShieldAlert className="size-8 opacity-30" />
                        <p className="text-sm">Belum ada data risiko</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
                        {/* ── Donut ── */}
                        <div className="relative shrink-0">
                            <ChartContainer
                                config={chartConfig}
                                className="size-[160px]"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                hideLabel
                                                formatter={(value, name) => (
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <span className="font-semibold">{value}</span>
                                                        <span className="text-muted-foreground">pasien</span>
                                                    </div>
                                                )}
                                            />
                                        }
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={48}
                                        outerRadius={72}
                                        strokeWidth={2}
                                        stroke="var(--background)"
                                    >
                                        {chartData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                            {/* Centre label */}
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold leading-none">{total}</span>
                                <span className="text-[10px] text-muted-foreground">total</span>
                            </div>
                        </div>

                        {/* ── Legend ── */}
                        <div className="flex w-full flex-col gap-2 sm:max-w-[180px]">
                            {chartData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span
                                            className="size-2.5 shrink-0 rounded-full"
                                            style={{ backgroundColor: item.fill }}
                                        />
                                        <span className="truncate text-xs text-muted-foreground">
                                            {item.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-xs font-semibold tabular-nums">{item.value}</span>
                                        <span className={cn(
                                            'rounded px-1 py-0.5 text-[10px] font-medium tabular-nums',
                                            'bg-muted text-muted-foreground',
                                        )}>
                                            {item.pct}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
