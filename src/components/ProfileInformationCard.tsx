import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/TextField";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { UserAvatar } from "~/components/UserAvatar";
import { useEffect, useState } from "react";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { useLoader } from "~/store/useLoader";
import { useAxios } from "~/hooks/useAxios";
import { toast } from "sonner";
import { z } from "zod";
import { useTamboComponentState } from "@tambo-ai/react";

export const ProfileInformationCardSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().min(1, { message: "Email is required" }).describe("This is always required"),
})
export type ProfileForm = z.infer<typeof ProfileInformationCardSchema>;

export function ProfileInformationCard() {

  const { user, setUser } = useAuthenticationStore();
  const { loading, start, stop } = useLoader();
  const { $http } = useAxios();
  const [profileFormErrors, setProfileFormErrors] = useTamboComponentState<Record<string, any>>("profileFormErrors", {});
  const [profileForm, setProfileForm] = useTamboComponentState<ProfileForm>("profileForm", {
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
  });

  const handleProfileFormChange = (field: keyof ProfileForm, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }) as ProfileForm);
    setProfileFormErrors({ ...profileFormErrors, [field]: null });
  };

  useEffect(() => {
    setProfileForm({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
    });
  }, [user]);

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
    <Card>
      <CardHeader>
        <pre>{JSON.stringify(ProfileInformationCard, null, 2)}</pre>
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
              value={profileForm?.firstName || ''}
              onChange={(e) => handleProfileFormChange('firstName', e.target.value)}
              className="flex-1"
            />
            <TextField
              id="last_name"
              label="Last Name"
              value={profileForm?.lastName || ''}
              onChange={(e) => handleProfileFormChange('lastName', e.target.value)}
              className="flex-1"
            />
          </div>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={profileForm?.email}
            onChange={(e) => handleProfileFormChange('email', e.target.value)}
            error={profileFormErrors?.email ?? null}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveProfile} disabled={loading}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
