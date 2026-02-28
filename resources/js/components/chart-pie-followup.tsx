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
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Cell, Pie, PieChart } from 'recharts';

interface FollowUpItem {
    label: string;
    data: number; // persentase
    count: number; // jumlah aktual
}

interface ChartPieFollowUpProps {
    followups: FollowUpItem[];
    filters?: DashboardFilters;
}

/** Warna tetap agar konsisten */
const FOLLOWUP_COLORS: Record<string, string> = {
    'Sudah Follow Up': 'var(--chart-2)',
    'Belum Follow Up': 'var(--chart-5)',
};

export default function ChartPieFollowUp({
    followups,
    filters,
}: ChartPieFollowUpProps) {
    const total = followups.reduce((sum, d) => sum + d.count, 0);

    const chartData = followups.map((item) => ({
        name: item.label,
        value: item.count,
        pct: item.data,
        fill: FOLLOWUP_COLORS[item.label] ?? 'var(--chart-3)',
    }));

    const chartConfig: ChartConfig = {
        value: { label: 'Pasien' },
        ...Object.fromEntries(
            chartData.map((d) => [d.name, { label: d.name, color: d.fill }]),
        ),
    };

    const subtitle = filters
        ? `${format(new Date(filters.date_from), 'd MMM yyyy', { locale: idLocale })} – ${format(new Date(filters.date_to), 'd MMM yyyy', { locale: idLocale })}`
        : 'Semua Data';

    const isEmpty = total === 0;

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Tindak Lanjut</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 items-center justify-center px-4 pb-4">
                {isEmpty ? (
                    <p className="text-sm text-muted-foreground">
                        Tidak ada data pada periode ini
                    </p>
                ) : (
                    <div className="flex w-full items-center gap-4">
                        {/* ── Donut (kiri) ───────────────────────────── */}
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-square w-full max-w-[160px] shrink-0"
                        >
                            <PieChart>
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value, name) => (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="font-medium">
                                                        {name}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {value} pasien
                                                    </span>
                                                </span>
                                            )}
                                            hideLabel
                                        />
                                    }
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius="55%"
                                    outerRadius="80%"
                                    paddingAngle={3}
                                    strokeWidth={0}
                                >
                                    {chartData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.fill}
                                        />
                                    ))}
                                </Pie>
                                <text
                                    x="50%"
                                    y="46%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={26}
                                    fontWeight={700}
                                    fill="currentColor"
                                >
                                    {total}
                                </text>
                                <text
                                    x="50%"
                                    y="63%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={11}
                                    fill="currentColor"
                                    opacity={0.5}
                                >
                                    Total
                                </text>
                            </PieChart>
                        </ChartContainer>

                        {/* ── Legend (kanan) ─────────────────────────── */}
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            {chartData.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span
                                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                                        style={{ backgroundColor: item.fill }}
                                    />
                                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                                        {item.name}
                                    </span>
                                    <span className="shrink-0 font-medium tabular-nums">
                                        {item.value}
                                    </span>
                                    <span className="w-8 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                                        {item.pct}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
