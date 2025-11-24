import { Pie, PieChart, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartPieFollowUpProps {
  followups: { label: string; data: number }[]
}

export const description = "Follow Up Pie Chart"

export default function ChartPieFollowUp({ followups }: ChartPieFollowUpProps) {
  // === Mapping data ===
  const chartData = followups.map((item, index) => ({
    name: item.label,
    value: item.data,
    fill: `var(--chart-${index + 1})`,
  }))

  // === Dynamic chart config ===
  const chartConfig: ChartConfig = {
    value: { label: "Percentage" },
    ...chartData.reduce((acc: any, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      }
      return acc
    }, {}),
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Follow Up & Un Follow Up</CardTitle>
        <CardDescription>All data record</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => `${value}%`}
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
