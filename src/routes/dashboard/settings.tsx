import { createFileRoute } from "@tanstack/react-router";
import { Page } from "~/components/Page";
import { AppBreadcrumb } from "~/components/AppBreadcrumb";
import { useAuth, useCurrentUser, useCurrentUserProfile } from "~/hooks/api";
import { toast } from "sonner";
import { useState, useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "~/components/ui/panel";
import { UserAvatar } from "~/components/UserAvatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Upload, User, Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

const profileSettingsSchema = z.object({
  name: z
    .string()
    .min(1, "Display name is required")
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be 50 characters or less")
    .trim(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
});

type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

function ProfileSettings() {
  const { user } = useAuth();
  const { profile, updateProfile, mutation: updateMutation } = useCurrentUserProfile();
  const { uploadAvatar, mutations: { uploadAvatar: uploadAvatarMutation } } = useCurrentUser();
  const isUploading = uploadAvatarMutation.isPending;

  const form = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: user?.name || "",
      bio: profile?.bio || "",
    },
  });

  // Update form when data changes
  useEffect(() => {
    if (user?.name && profile?.bio !== undefined) {
      form.reset({ name: user.name, bio: profile.bio });
    }
  }, [user?.name, profile?.bio, form]);

  const handleAvatarUpload = useCallback(async (file: File) => {
    try {
      await uploadAvatar(file);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar");
    }
  }, [uploadAvatar]);

  const onSubmit = async (data: ProfileSettingsFormData) => {
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-6">
        {/* Profile Settings Row */}
        <div className="flex items-start gap-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-2">
            <Label className="self-start">Profile Picture</Label>
            <div className="relative cursor-pointer group w-20 h-20">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAvatarUpload(file);
                  }
                }}
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer"
              >
                <UserAvatar
                  imageUrl={user?.image}
                  name={user?.name}
                  email={user?.email}
                  size="xl"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Upload className="h-5 w-5 text-white" />
                  )}
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Click to upload
              <br />
              PNG, JPG, GIF up to 5MB
            </p>
          </div>

          {/* Profile Information */}
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your display name"
                          disabled={updateMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Tell us about yourself"
                          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={updateMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={
                    updateMutation.isPending ||
                    !form.formState.isDirty ||
                    !form.formState.isValid
                  }
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </PanelContent>
    </Panel>
  );
}

function SettingsPage() {
  return (
    <Page>
      <AppBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", icon: Home },
          { label: "Settings" },
        ]}
      />

      <div className="mt-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile information and avatar
          </p>
        </div>

        <ProfileSettings />
      </div>
    </Page>
  );
}