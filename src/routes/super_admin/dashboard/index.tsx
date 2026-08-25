import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { useAxios } from "~/hooks/useAxios";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { DateRange, WebAnalytics } from "~/components/analytics";
import { useState } from "react";
import { ForbiddenError } from "~/components/ForbiddenError";
import { z } from "zod";
import { Loader2 } from "lucide-react";

export const SuperAdminDashboardSchema = z.object({
  range: z.string().optional(),
})

export type SuperAdminDashboard = z.infer<typeof SuperAdminDashboardSchema>;

export function SuperAdminDashboardPage() {
  const { $http } = useAxios();

  const [range, setRange] = useState<DateRange>('week');

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics-dashboard', range],
    queryFn: async () => {
      const res = await $http.get('/activity/dashboard', {
        params: { range },
      });
      return res.data;
    },
  });

  const pages = data?.data?.chartData?.pages;
  const labels = Array.isArray(pages?.labels) ? pages.labels : [];
  const values = Array.isArray(pages?.datasets?.[0]?.data) ? pages.datasets[0].data : [];
  const chartData = labels.map((date: string, i: number) => ({ date, count: values[i] ?? 0, }));
  const topPages = data?.data?.topPages;
  const metrics = data?.data?.metrics;
  // const metricsData = [
  //   {value: pageSummary?.uniqueUsers, label: 'Unique Users'},
  //   {value: pageSummary?.totalVisits, label: 'Total Route Usage'},
  //   {value: pageSummary?.avgResponseTime, label: 'Average Response Time'},
  // ];

  if (error) return <ForbiddenError error={(error as any)?.response?.data} />;

  return (
    <DashboardLayout>
      {isLoading && (
        <div className="flex h-[400px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {data && (
        <WebAnalytics
          title="Route Endpoint Analytics"
          status="Online"
          chartData={chartData}
          topPages={topPages}
        onDateRangeChange={(newRange: DateRange) => {
          setRange(newRange); // 🔥 THIS triggers refetch automatically
        }}
        metrics={metrics}
      />
      )}
    </DashboardLayout>
  );
}


export const Route = createFileRoute("/super_admin/dashboard/")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated, user } = useAuthenticationStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/signin',
        search: { redirect: location.pathname }
      });
    }

    if (user.role !== 'super_admin') {
      throw redirect({
        to: '/forbidden'
      });
    }
  },
  component: SuperAdminDashboardPage,
});
