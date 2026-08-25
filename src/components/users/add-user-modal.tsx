import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TextField } from "~/components/ui/TextField";
import { useCreateUser } from "~/hooks/api/use-create-user";

export const formSchema = z.object({
  firstName: z.string().min(2, "Required field"),
  lastName: z.string().min(2, "Required field"),
  email: z.email("Invalid email address").min(2, "Required field"),
  roles: z.enum(["admin", "manager", "user"]),
});

export type FormValues = z.infer<typeof formSchema>;

interface AddUserModalProps {
  onSuccess?: () => void;
}

export function AddUserModal({ onSuccess }: AddUserModalProps) {
  const [open, setOpen] = useState(false);
  const { createUser, isCreating } = useCreateUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roles: "user",
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  const onSubmit = (values: FormValues) => {
    const randomPassword = Math.random().toString(36).substring(2, 15);
    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: randomPassword, // Temporary password for new users
      roles: values.roles,
    };

    createUser(userData, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        toast.success("User created successfully!");
        onSuccess?.();
      },
      onError: (error: any) => {
        const errorData = error.response?.data;
        
        if (errorData?.errors) {
          // Map backend errors to form fields
          Object.entries(errorData.errors).forEach(([field, message]) => {
            form.setError(field as keyof FormValues, {
              type: "server",
              message: message as string,
            });
          });
        } else {
          toast.error(error.message || "Failed to create user");
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account by filling in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    error={form.formState.errors.firstName?.message}
                    onChange={(e) => field.onChange(e.target.value)}
                    required
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    error={form.formState.errors.lastName?.message}
                    onChange={(e) => field.onChange(e.target.value)}
                    required
                  />
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={form.formState.errors.email?.message}
                  onChange={(e) => field.onChange(e.target.value)}
                  required
                />
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}