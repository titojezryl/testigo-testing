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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  ExternalLink,
  MoreHorizontal,
  Calendar,
  Globe,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "~/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

export type DateRange = "today" | "week" | "month" | "quarter" | "year";
export type Environment = "production" | "preview" | "development";

export interface WebAnalyticsMetric {
  value: string | number;
  change?: number; // percentage, e.g. 200 or -20
  label: string;
}

export interface WebAnalyticsChartPoint {
  date: string;
  count: number;
  label?: string;
}

export interface PageStat {
  path: string;
  count: number;
}

export interface ReferrerStat {
  name: string;
  url?: string;
  uniqueVisitors: number;
  icon?: "google" | "facebook" | "twitter" | "direct" | "other";
}

export interface WebAnalyticsProps {
  /** Page title */
  title?: string;
  /** Domain shown under title with link */
  domain?: string;
  /** Domain href (defaults to domain with https) */
  domainHref?: string;
  /** Status label e.g. "Online" */
  status?: string;
  /** Show alert banner */
  showAlert?: boolean;
  alertMessage?: string;
  /** Date range filter value */
  dateRange?: DateRange;
  /** Metric cards: uniqueVisitors, page views, bounce rate */
  metrics?: {
    uniqueVisitors: any;
    totalVisits: any;
    avgResponseTime: any;
  };
  /** Chart time series data */
  chartData?: WebAnalyticsChartPoint[];
  /** Top pages with visitor counts */
  topPages?: PageStat[];
  /** Top referrers */
  topReferrers?: ReferrerStat[];
  /** Callbacks for filters (optional, for controlled usage) */
  onEnvironmentChange?: (env: Environment) => void;
  onDateRangeChange?: (range: DateRange) => void;
  className?: string;
}

// ─── Default / mock data ───────────────────────────────────────────────────

const defaultChartData: WebAnalyticsChartPoint[] = [
  { date: "Feb 19", count: 0 },
  { date: "Feb 20", count: 0 },
  { date: "Feb 21", count: 1 },
  { date: "Feb 22", count: 0 },
  { date: "Feb 23", count: 3 },
  { date: "Feb 24", count: 0 },
  { date: "Feb 25", count: 0 },
  { date: "Feb 26", count: 1 },
];

const defaultTopReferrers: ReferrerStat[] = [
  { name: "google.com", uniqueVisitors: 1, icon: "google" },
  { name: "l.facebook.com", uniqueVisitors: 1, icon: "facebook" },
  { name: "m.facebook.com", uniqueVisitors: 1, icon: "facebook" },
];

// ─── Tab strip (simple state-based tabs) ───────────────────────────────────

function TabsList({
  tabs,
  value,
  onValueChange,
  className,
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-0 rounded-lg border border-border bg-muted/50 p-0.5 text-muted-foreground",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Referrer icon ─────────────────────────────────────────────────────────

function ReferrerIcon({ icon }: { icon?: ReferrerStat["icon"] }) {
  if (!icon) return null;
  const size = 16;
  if (icon === "google")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    );
  if (icon === "facebook")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0" fill="#1877F2" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  return (
    <Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden />
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function WebAnalytics({
  title = "Web Analytics",
  showAlert = false,
  alertMessage = "Take action to secure your project. Update Project",
  dateRange = "week",
  metrics = {
    uniqueVisitors: { value: 3, change: 200, label: "Visitors" },
    totalVisits: { value: 4, change: -20, label: "Page Views" },
    avgResponseTime: { value: "67%", label: "Bounce Rate" },
  },
  chartData = defaultChartData,
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
      {/* Alert banner */}
      {showAlert && (
        <div
          className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {alertMessage}
          <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
            Update Project
          </Button>
        </div>
      )}

      {/* Header: title, domain, status, filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* <Select value={env} onValueChange={handleEnv}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="preview">Preview</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select> */}
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
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More options">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Refresh</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{metrics.uniqueVisitors.value}</span>
              {metrics.uniqueVisitors.change != null && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    metrics.uniqueVisitors.change >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                  aria-label={`${metrics.uniqueVisitors.change >= 0 ? "Up" : "Down"} ${Math.abs(metrics.uniqueVisitors.change)}%`}
                >
                  {metrics.uniqueVisitors.change >= 0 ? (
                    <TrendingUp className="mr-0.5 inline size-4" />
                  ) : (
                    <TrendingDown className="mr-0.5 inline size-4" />
                  )}
                  {metrics.uniqueVisitors.change >= 0 ? "+" : ""}
                  {metrics.uniqueVisitors.change}%
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{metrics.uniqueVisitors.label}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{metrics.totalVisits.value}</span>
              {metrics.totalVisits.change != null && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    metrics.totalVisits.change >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {metrics.totalVisits.change >= 0 ? (
                    <TrendingUp className="mr-0.5 inline size-4" />
                  ) : (
                    <TrendingDown className="mr-0.5 inline size-4" />
                  )}
                  {metrics.totalVisits.change >= 0 ? "+" : ""}
                  {metrics.totalVisits.change}%
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{metrics.totalVisits.label}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <span className="text-2xl font-semibold">{metrics.avgResponseTime.value}</span>
            <p className="mt-1 text-sm text-muted-foreground">{metrics.avgResponseTime.label}</p>
          </CardContent>
        </Card>
      </div>

      {/* Area chart - uses CSS variables so text and grid respect light/dark theme */}
      <Card>
        <CardHeader className="pb-2" />
        <CardContent className="pb-6">
          <div className="web-analytics-chart h-[240px] w-full [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-text]:fill-foreground">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
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

      {/* Bottom: Pages / Referrers */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <TabsList
              tabs={[
                // { value: "pages", label: "Pages" },
                { value: "routes", label: "Routes" },
                // { value: "hostnames", label: "Hostnames" },
              ]}
              value={leftTab}
              onValueChange={setLeftTab}
            />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b border-border py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>Endpoint</span>
                <span>Route Usage</span>
              </div>
              {/* {leftTab === "pages" &&
                topPages.map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between border-b border-border/60 py-3 last:border-0"
                  >
                    <span className="font-mono text-sm">{page.path || "/"}</span>
                    <span className="tabular-nums text-sm">{page.count}</span>
                  </div>
                ))} */}
              {leftTab === "routes" && (
                topPages?.map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between border-b border-border/60 py-3 last:border-0"
                  >
                    <span className="font-mono text-sm">{page.path || "/"}</span>
                    <span className="tabular-nums text-sm">{page.count}</span>
                  </div>
                ))
              )}
              {leftTab === "hostnames" && (
                <p className="py-4 text-sm text-muted-foreground">No hostname data.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="pb-3">
            <TabsList
              tabs={[
                { value: "referrers", label: "Referrers" },
                { value: "utm", label: "UTM Parameters" },
              ]}
              value={rightTab}
              onValueChange={setRightTab}
            />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b border-border py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>Referrer</span>
                <span>Visitors</span>
              </div>
              {rightTab === "referrers" &&
                topReferrers.map((ref) => (
                  <div
                    key={ref.name}
                    className="flex items-center justify-between border-b border-border/60 py-3 last:border-0"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <ReferrerIcon icon={ref.icon} />
                      {ref.name}
                    </span>
                    <span className="tabular-nums text-sm">{ref.uniqueVisitors}</span>
                  </div>
                ))}
              {rightTab === "utm" && (
                <p className="py-4 text-sm text-muted-foreground">No UTM data.</p>
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
