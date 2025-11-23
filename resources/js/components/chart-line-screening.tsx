import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartLineScreeningProps {
  screening_days: any[];
  screening_weeks: any[];
  screening_months: any[];
}

const chartConfig = {
  postpartum: {
    label: "Screening Postpartum",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ChartLineScreening({
  screening_days,
  screening_weeks,
  screening_months,
}: ChartLineScreeningProps) {

  const [timeRange, setTimeRange] = React.useState("days");

  // pilih data berdasarkan opsi user
  const chartData = React.useMemo(() => {
    switch (timeRange) {
      case "days":
        return screening_days.map(d => ({
          label: d.date,
          total: d.total,
        }));

      case "weeks":
        return screening_weeks.map(w => ({
          label: w.week,
          total: w.total,
        }));

      case "months":
        return screening_months.map(m => ({
          label: m.month,
          total: m.total,
        }));

      default:
        return [];
    }
  }, [timeRange, screening_days, screening_weeks, screening_months]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Screening Postpartum</CardTitle>
          <CardDescription>
            Screening summary by days, weeks, or months
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex cursor-pointer">
            <SelectValue placeholder="Select" />
          </SelectTrigger>

          <SelectContent className="rounded-xl">
            <SelectItem value="days" className="rounded-lg cursor-pointer">Last 7 Days</SelectItem>
            <SelectItem value="weeks" className="rounded-lg cursor-pointer">Last 4 Weeks</SelectItem>
            <SelectItem value="months" className="rounded-lg cursor-pointer">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPostpartum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => label}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillPostpartum)"
              stroke="var(--chart-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
