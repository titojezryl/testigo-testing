import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { useAxios } from "~/hooks/useAxios";
import { AnalyticsEventTable } from "~/components/analytics";
function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Your Dashboard
        </h1>
        
        <div>
          <AnalyticsEventTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/super_admin/analytics/")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated, user } = useAuthenticationStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/signin',
        search: { redirect: location.pathname }
      });
    }

    if (!user.role || user.role !== 'super_admin') {
      throw redirect({
        to: '/forbidden'
      });
    }
  },
  component: AnalyticsPage,
});