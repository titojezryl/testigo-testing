import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { z } from "zod";

export const WebAnalyticsChartCardSchema = z.object({
  data: z.array(z.object({
    date: z.string(),
    count: z.number(),
    label: z.string().optional(),
  })),
})
export type WebAnalyticsChartCard = z.infer<typeof WebAnalyticsChartCardSchema>;

export interface WebAnalyticsChartCardProps {
  data?: { date: string; count: number; label?: string }[];
}

export function WebAnalyticsChartCard({ data }: WebAnalyticsChartCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2" />
      <CardContent className="pb-6">
        <div className="web-analytics-chart h-[240px] w-full [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-text]:fill-foreground">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="webAnalyticsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--foreground)" }}
                allowDecimals={false}
                width={24}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                itemStyle={{ color: "var(--foreground)" }}
                formatter={(value: number | undefined) => [value ?? 0, "Total Route Usage"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--primary)"
                strokeWidth={1.5}
                fill="url(#webAnalyticsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

