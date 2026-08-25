import * as React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  const changeColors = {
    positive: "text-green-500 bg-green-500/10",
    negative: "text-red-500 bg-red-500/10",
    neutral: "text-gray-500 bg-gray-500/10",
  };

  const changeSymbol = changeType === "positive" ? "+" : changeType === "negative" ? "-" : "";

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                <Badge className={`${changeColors[changeType]} border-0 text-xs font-medium px-1.5 py-0.5`}>
                  {changeSymbol}{change}
                </Badge>
                <span className="text-xs text-muted-foreground">vs last period</span>
              </div>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

interface ChartDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  metric: "visitors" | "pageViews";
}

function AnalyticsChart({ data, metric }: AnalyticsChartProps) {
  const color = metric === "visitors" ? "#3b82f6" : "#8b5cf6";
  const dataKey = metric === "visitors" ? "visitors" : "pageViews";

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
            }}
            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
            formatter={(value: number) => [value.toLocaleString(), metric === "visitors" ? "Visitors" : "Page Views"]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradient-${metric})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PagesTableProps {
  pages: Array<{ path: string; visitors: number; uniqueVisitors: number }>;
}

function PagesTable({ pages }: PagesTableProps) {
  return (
    <div className="rounded-md border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Path</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Visitors</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Unique</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page, index) => (
            <tr key={page.path} className={index !== pages.length - 1 ? "border-b border-border/50" : ""}>
              <td className="px-4 py-3 font-mono text-xs">{page.path}</td>
              <td className="px-4 py-3 text-right">{page.visitors.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{page.uniqueVisitors.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ReferrersTableProps {
  referrers: Array<{ source: string; visitors: number; icon?: string }>;
}

function ReferrersTable({ referrers }: ReferrersTableProps) {
  const getFavicon = (source: string) => {
    const domain = source.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  return (
    <div className="rounded-md border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Visitors</th>
          </tr>
        </thead>
        <tbody>
          {referrers.map((referrer, index) => (
            <tr key={referrer.source} className={index !== referrers.length - 1 ? "border-b border-border/50" : ""}>
              <td className="px-4 py-3 flex items-center gap-2">
                <img
                  src={getFavicon(referrer.source)}
                  alt=""
                  className="w-4 h-4 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span>{referrer.source}</span>
              </td>
              <td className="px-4 py-3 text-right">{referrer.visitors.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface WebAnalyticsDashboardProps {
  projectName?: string;
  projectIcon?: string;
  environment?: "production" | "preview" | "development";
  dateRange?: string;
}

export function WebAnalyticsDashboard({
  projectName = "my-app.vercel.app",
  projectIcon,
  environment = "production",
  dateRange = "Last 7 Days",
}: WebAnalyticsDashboardProps) {
  // Sample data - in real implementation, this would come from API
  const chartData: ChartDataPoint[] = [
    { date: "2025-02-19", visitors: 12, pageViews: 45 },
    { date: "2025-02-20", visitors: 19, pageViews: 67 },
    { date: "2025-02-21", visitors: 15, pageViews: 52 },
    { date: "2025-02-22", visitors: 23, pageViews: 89 },
    { date: "2025-02-23", visitors: 31, pageViews: 112 },
    { date: "2025-02-24", visitors: 18, pageViews: 61 },
    { date: "2025-02-25", visitors: 25, pageViews: 78 },
    { date: "2025-02-26", visitors: 3, pageViews: 12 },
  ];

  const pagesData = [
    { path: "/", visitors: 3, uniqueVisitors: 2 },
    { path: "/resume", visitors: 1, uniqueVisitors: 1 },
    { path: "/about", visitors: 1, uniqueVisitors: 1 },
    { path: "/projects", visitors: 1, uniqueVisitors: 1 },
    { path: "/contact", visitors: 1, uniqueVisitors: 1 },
  ];

  const referrersData = [
    { source: "google.com", visitors: 1 },
    { source: "facebook.com", visitors: 1 },
    { source: "m.facebook.com", visitors: 1 },
    { source: "twitter.com", visitors: 1 },
    { source: "linkedin.com", visitors: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Web Analytics</h1>
            {projectIcon && (
              <img src={projectIcon} alt="" className="w-5 h-5 rounded" />
            )}
            <span className="text-sm text-muted-foreground">{projectName}</span>
          </div>
          <p className="text-sm text-muted-foreground">0 online</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue={environment}
          >
            <option value="production">Production</option>
            <option value="preview">Preview</option>
            <option value="development">Development</option>
          </select>
          <select
            className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue={dateRange}
          >
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>
          <button className="h-9 w-9 rounded-md border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Visitors"
          value={3}
          change="200%"
          changeType="positive"
        />
        <MetricCard
          title="Page Views"
          value={4}
          change="50%"
          changeType="negative"
        />
        <MetricCard
          title="Bounce Rate"
          value="67%"
          change="12%"
          changeType="neutral"
        />
      </div>

      {/* Chart */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <AnalyticsChart data={chartData} metric="visitors" />
        </CardContent>
      </Card>

      {/* Pages and Referrers */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="border-b border-border/50 p-4">
              <h3 className="text-sm font-semibold">Pages</h3>
            </div>
            <PagesTable pages={pagesData} />
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="border-b border-border/50 p-4">
              <h3 className="text-sm font-semibold">Referrers</h3>
            </div>
            <ReferrersTable referrers={referrersData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
