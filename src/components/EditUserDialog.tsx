import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useAdminUpdateUser } from "~/hooks/useUsers";
import type { UserRole } from "~/db/schema";

// Edit user form schema - only email and role are editable
// Password updates are handled separately for security
const editUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["super_admin", "admin", "guest", "none"]).optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole | null;
}

interface EditUserDialogProps {
  user: UserData;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function EditUserDialog({
  user,
  trigger,
  onSuccess,
}: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const updateUserMutation = useAdminUpdateUser();

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      email: user.email,
      role: user.role ?? "none",
    },
  });

  // Reset form when user data changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        email: user.email,
        role: user.role ?? "none",
      });
    }
  }, [open, user.email, user.role, form]);

  const onSubmit = (data: EditUserFormData) => {
    // Convert "none" back to null for the API
    const role = data.role === "none" ? null : data.role;

    updateUserMutation.mutate(
      {
        data: {
          userId: user.id,
          email: data.email,
          role: role,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          onSuccess?.();
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset({
        email: user.email,
        role: user.role ?? "none",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details for {user.name}. Password changes are handled
            separately for security.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Role</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="business_analyst">
                        Business Analyst
                      </SelectItem>
                      <SelectItem value="quality_assurance">
                        Quality Assurance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Export schema and types for reuse
export { editUserSchema };
export type { EditUserFormData, UserData as EditUserData };
