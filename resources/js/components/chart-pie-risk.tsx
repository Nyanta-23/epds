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
import { LabelList, Pie, PieChart } from 'recharts';

interface ChartPieRiskProps {
    risk_distributions: {
        label: string;
        value: number;
    }[];
    filters?: DashboardFilters;
}

export const description = 'EPDS Risk Distribution Chart';

export default function ChartPieRisk({
    risk_distributions,
    filters,
}: ChartPieRiskProps) {
    // --- Map data ---
    const chartData = risk_distributions
        .filter((item) => item.value > 0)
        .map((item, index) => ({
            name: item.label,
            value: item.value,
            fill: `var(--chart-${index + 1})`,
        }));

    const chartConfig: ChartConfig = {
        value: { label: 'Total' },
        ...chartData.reduce((acc: any, item) => {
            acc[item.name] = {
                label: item.name,
                color: item.fill,
            };
            return acc;
        }, {}),
    };

    const subtitle = filters
        ? `${format(new Date(filters.date_from), 'd MMM yyyy', { locale: idLocale })} – ${format(new Date(filters.date_to), 'd MMM yyyy', { locale: idLocale })}`
        : 'Hasil Skrining Minggu ini';

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Distribusi Resiko</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value) => value}
                                />
                            }
                        />

                        <Pie data={chartData} dataKey="value" nameKey="name">
                            <LabelList
                                dataKey="name"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
