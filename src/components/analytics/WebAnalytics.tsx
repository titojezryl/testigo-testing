import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import { z } from "zod";
import { MetricCard, MetricCardProps } from "~/components/analytics/MetricCard";
import { WebAnalyticsChartCard } from "~/components/analytics/WebAnalyticsChartCard";
import { WebAnalyticsRoutesTable } from "~/components/analytics/WebAnalyticsRoutesTable";

// ─── Types ─────────────────────────────────────────────────────────────────

export type DateRange = "today" | "week" | "month" | "quarter" | "year";
export type Environment = "production" | "preview" | "development";

export const WebAnalyticsSchema = z.object({
  title: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.string().optional(),
  metrics: z.object({
    totalVisits: z.object({
      value: z.number(),
      label: z.string(),
    }),
    uniqueVisitors: z.object({
      value: z.number(),
      label: z.string(),
    }),
    avgResponseTime: z.object({
      value: z.number(),
      label: z.string(),
    }),
    totalLogins: z.object({
      value: z.number(),
      label: z.string(),
    }),
    failedLogins: z.object({
      value: z.number(),
      label: z.string(),
    }),
    failureRate: z.object({
      value: z.number(),
      label: z.string(),
    }),
    successRate: z.object({
      value: z.number(),
      label: z.string(),
    }),
  }),
  chartData: z.array(z.object({
    date: z.string(),
    count: z.number(),
  })),
  topPages: z.array(z.object({
    path: z.string(),
    count: z.number(),
  })),
});

export type WebAnalytics = z.infer<typeof WebAnalyticsSchema>;

export interface WebAnalyticsChartPoint {
  date: string;
  count: number;
  label?: string;
}

export interface PageStat {
  path: string;
  count: number;
}

export interface WebAnalyticsProps {
  /** Page title */
  title?: string;
  status?: string;
  /** Date range filter value */
  dateRange?: DateRange;
  /** Metric cards: uniqueVisitors, page views, bounce rate */
  metrics?: MetricCardProps;
  /** Chart time series data */
  chartData?: WebAnalyticsChartPoint[];
  /** Top pages with visitor counts */
  topPages?: PageStat[];
  /** Callbacks for filters (optional, for controlled usage) */
  onDateRangeChange?: (range: DateRange) => void;
  className?: string;
}

// ─── Main component ─────────────────────────────────────────────────────────

export function WebAnalytics({
  title = "Web Analytics",
  dateRange = "week",
  metrics,
  chartData,
  topPages,
  onDateRangeChange,
  className,
}: WebAnalyticsProps) {
  const [range, setRange] = React.useState(dateRange);
  const [leftTab, setLeftTab] = React.useState("routes");
  const [rightTab, setRightTab] = React.useState("referrers");

  const handleRange = (v: string) => {
    setRange(v as DateRange);
    onDateRangeChange?.(v as DateRange);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header: title, domain, status, filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={handleRange}>
            <SelectTrigger className="w-[200px]">
              <Calendar className="mr-2 size-4 shrink-0 opacity-50" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
              {/* <SelectItem value="year">Last 90 Days</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metric cards */}
      <MetricCard data={metrics as any} />

      <WebAnalyticsChartCard data={chartData} />
      <WebAnalyticsRoutesTable
        topPages={topPages}
        leftTab={leftTab}
        onLeftTabChange={setLeftTab}
      />
    </div>
  );
}
