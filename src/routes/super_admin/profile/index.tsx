import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { ChangePasswordForm } from "~/components/ChangePasswordForm";
import { MFAToggle } from "~/components/MFAToggle";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { redirect } from "@tanstack/react-router";
import { InteractableProfileInformationCard } from "~/components/ProfileInformationCard.interactable";


function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile information
          </p>
        </div>
        
        <div className="grid gap-6">
          <InteractableProfileInformationCard />
          <MFAToggle />
          <ChangePasswordForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/super_admin/profile/")({
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
  component: ProfilePage,
});