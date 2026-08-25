import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { AnalyticsEventTable } from "~/components/analytics/analytics-event-table";
import {useAxios} from '~/hooks/useAxios';
import { useQuery } from "@tanstack/react-query";

function AnalyticsPage() {
  const { $http, fetchData } = useAxios();

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['analytics'],
  //   queryFn: () => $http.get('/activity/pages'),
  // });
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            View your application analytics and metrics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="text-2xl font-bold">10,234</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="text-2xl font-bold">+12.5%</div>
            <div className="text-sm text-muted-foreground">Growth</div>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="text-2xl font-bold">42.3%</div>
            <div className="text-sm text-muted-foreground">Engagement</div>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-muted-foreground">Active Now</div>
          </div>
        </div>

        <div>
          <AnalyticsEventTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/dashboard/analytics/")({
  component: AnalyticsPage,
});