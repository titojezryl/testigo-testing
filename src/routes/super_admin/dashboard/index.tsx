import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { useAxios } from "~/hooks/useAxios";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { DateRange, WebAnalytics } from "~/components/analytics";
import { useState } from "react";

function DashboardHome() {
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

  return (
    <DashboardLayout>
      <WebAnalytics
        title="Route Endpoint Analytics"
        status="Online"
        showAlert={false}
        chartData={chartData}
        topPages={data?.data?.pageSummary?.topPages}
        onDateRangeChange={(newRange: DateRange) => {
          setRange(newRange); // 🔥 THIS triggers refetch automatically
        }}
        metrics={{
          uniqueVisitors: {
            value: data?.data?.pageSummary?.uniqueUsers,
            label: "Unique Users",
          },
          totalVisits: {
            value: data?.data?.pageSummary?.totalVisits,
            label: "Total Route Usage",
          },
          avgResponseTime: {
            value: data?.data?.pageSummary?.avgResponseTime,
            label: "Average Response Time",
          },
        }}
      />
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
  component: DashboardHome,
});
