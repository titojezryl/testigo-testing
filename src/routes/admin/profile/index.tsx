import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/TextField";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { UserAvatar } from "~/components/UserAvatar";
import { ChangePasswordForm } from "~/components/ChangePasswordForm";
import { MFAToggle } from "~/components/MFAToggle";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { useLoader } from "~/store/useLoader";
import {useAxios} from "~/hooks/useAxios";
import { toast } from "sonner";
import { redirect } from "@tanstack/react-router";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

function ProfilePage() {
  const { user, setUser } = useAuthenticationStore();
  const { loading, start, stop } = useLoader();
  const { $http } = useAxios();
  const [profileFormErrors, setProfileFormErrors] = useState<Record<string, any>>({});
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
  });

  const handleProfileFormChange = (field: keyof ProfileForm, value: string) => {
    setProfileForm({ ...profileForm, [field]: value });
    setProfileFormErrors({ ...profileFormErrors, [field]: null });
  };

  const handleSaveProfile = async () => {
    try {
      start();
      const { data } = await $http.patch(`/users/update`, profileForm);
      setUser(data);
      toast.success('Profile updated successfully', {
        position: 'top-right',
      });
    } catch (error: any) {
      setProfileFormErrors(error.response.data.errors);
    } finally {
      stop();
    }
  };

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
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <UserAvatar 
                  imageUrl={null}
                  name={user.name}
                  email={user.email}
                  size="xl"
                />
                <div className="space-y-2">
                  <Button variant="outline">Change Avatar</Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                  <TextField
                    id="first_name"
                    label="First Name"
                    value={profileForm.firstName}
                    onChange={(e) => handleProfileFormChange('firstName', e.target.value)}
                    className="flex-1"
                  />
                  <TextField
                    id="last_name"
                    label="Last Name"
                    value={profileForm.lastName}
                    onChange={(e) => handleProfileFormChange('lastName', e.target.value)}
                    className="flex-1"
                  />
                </div>
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => handleProfileFormChange('email', e.target.value)}
                  error={profileFormErrors.email}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={loading}>Save Changes</Button>
            </CardFooter>
          </Card>
          <MFAToggle />
          <ChangePasswordForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/admin/profile/")({
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
  component: ProfilePage,
});