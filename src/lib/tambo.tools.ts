import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { http } from "~/hooks/api/http";
import { ProfileForm } from "~/components/ProfileInformationCard";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { formSchema, FormValues } from "~/components/users/add-user-modal";

interface GetDashboardAnalyticsInput {
  range: 'week' | 'month' | 'quarter' | 'year';
}

async function getDashboardAnalytics(input: GetDashboardAnalyticsInput) {
  try {
  const res = await http.get("/activity/dashboard", {
      params: { range: input.range },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
}

export const DashboardAnalyticsTool: TamboTool = {
  name: "get_dashboard_analytics",
  description: "Get the dashboard analytics data",
  tool: getDashboardAnalytics,
  inputSchema: z.object({
    range: z.enum(['week', 'month', 'quarter', 'year']).describe("The range of the analytics data, always ask user for this value"),
  }),
  outputSchema: z.any(), // replace with a real schema once you know it
};

async function getMetricsData(input: GetDashboardAnalyticsInput) {
    try {
        const res = await http.get("/activity/dashboard", {
          params: { range: input.range },
        });
        const data = res.data.data;
        return data.metrics;
    }catch(error: any) {
        return error.response.data;
    }
  }

export const MetricsDataTool: TamboTool = {
  name: "get_metrics_data",
  description: "To get the dashboard metrics card data and pass to the props of the component, always show the component DashboardMetricCard.",
  tool: getMetricsData,
  inputSchema: z.object({
    range: z.enum(['week', 'month', 'quarter', 'year']).describe("The range of the analytics data, always ask user for this value"),
  }),
  outputSchema: z.any(), // replace with a real schema once you know it
};

async function updateProfileForm(input: ProfileForm) {
  try {
    const res = await http.patch("/users/update", input);
    useAuthenticationStore.getState().setUser(res.data);
    
    return res;
  } catch (error: any) {
    return error.response.data;
  }
}

export const UpdateProfileFormTool: TamboTool = {
  name: "update_profile_form",
  description: "Update the profile first_name, last_name, email. email should be required",
  tool: updateProfileForm,
  inputSchema: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().min(1, { message: "Email is required" }),
  }),
  outputSchema: z.any(),
};


async function createUser(input: FormValues) {
  try {
    const res = await http.post("/users/create", input);
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
}
export const createUserTool: TamboTool = {
  name: "create_user",
  description: "Create a new user",
  tool: createUser,
  inputSchema: formSchema,
  outputSchema: z.any(),
};

export const tools = [
    DashboardAnalyticsTool,
    MetricsDataTool,
    UpdateProfileFormTool,
    createUserTool,
];