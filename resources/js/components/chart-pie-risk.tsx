import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "EPDS Risk Distribution Chart";

interface ChartPieRiskProps {
  risk_distributions: {
    label: string;
    value: number;
  }[];
}

export default function ChartPieRisk({ risk_distributions }: ChartPieRiskProps) {

  const riskArr = risk_distributions.map((item, index) => ({
    label: item.label,
    value: item.value,
    fill: `var(--chart-${index + 1})`,
  }));

  const total = riskArr.reduce((sum, item) => sum + item.value, 0);

  const chartData = total === 0
    ? [{ label: "No Data", value: 1, fill: "#444" }]
    : riskArr;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>Today's Screening Results</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              label={(entry) =>
                total === 0 ? "No Data" : `${entry.label} (${entry.value})`
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
