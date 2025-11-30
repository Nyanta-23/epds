import { Pie, PieChart, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartPieRiskProps {
  risk_distributions: {
    label: string
    value: number
  }[]
}

export const description = "EPDS Risk Distribution Chart"

export default function ChartPieRisk({ risk_distributions }: ChartPieRiskProps) {


  // --- Map data ---
  const chartData = risk_distributions
    .filter((item) => item.value > 0)
    .map((item, index) => ({
      name: item.label,
      value: item.value,
      fill: `var(--chart-${index + 1})`,
    }))

  // --- Handle empty dataset ---
  // const hasData = chartData.some((item) => item.value > 0)

  // --- Dynamic Chart Config ---
  const chartConfig: ChartConfig = {
    value: { label: "Total" },
    ...chartData.reduce((acc: any, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      }
      return acc
    }, {}),
  }

  console.log(chartData);

  console.log(chartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>This Week's Screening Results</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
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
  )
}
