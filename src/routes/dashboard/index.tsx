import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const dashboardSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

type DashboardFormData = z.infer<typeof dashboardSchema>;

function DashboardHome() {
  const form = useForm<DashboardFormData>({
    resolver: zodResolver(dashboardSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: DashboardFormData) => {
    console.log("Form data:", data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Your Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Start building your application here
          </p>
        </div>

        <div className="max-w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="submit" className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Submit
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});
