import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { useAxios } from "~/hooks/useAxios";
import { ForbiddenError } from "~/components/ForbiddenError";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { redirect } from "@tanstack/react-router";

function DashboardHome() {
  const { $http } = useAxios();

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['analytics'],
  //   queryFn: async () => {
  //     const res = await $http.get('/activity/dashboard');
  //     return res.data;
  //   },
  // });

  // if (isLoading) return <div>Loading dashboard...</div>;
  // if (error) return <ForbiddenError error={error?.response?.data} />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Your Dashboard
        </h1>
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="text-2xl font-bold">{data?.data.auth.totalLogins}</div>
            <div className="text-sm text-muted-foreground">Total Logins</div>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="text-2xl font-bold">{data?.data.auth.failedLogins}</div>
            <div className="text-sm text-muted-foreground">Failed Logins</div>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="text-2xl font-bold">{data?.data.auth.failureRate}</div>
            <div className="text-sm text-muted-foreground">Failure Rate</div>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
}


export const Route = createFileRoute("/admin/dashboard/")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated, user } = useAuthenticationStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/signin',
        search: { redirect: location.pathname }
      });
    }

    if (!user.role || !['admin', 'super_admin'].includes(user.role)) {
      throw redirect({
        to: '/forbidden'
      });
    }
  },
  component: DashboardHome,
});
