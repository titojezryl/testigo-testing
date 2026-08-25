/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 * 
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 * 
 * IMPORTANT: If you have components in different directories (e.g., both ui/ and tambo/),
 * make sure all import paths are consistent. Run 'npx tambo migrate' to consolidate.
 * 
 * Read more about Tambo at https://docs.tambo.co
 */

import type { TamboComponent } from "@tambo-ai/react";
import { WebAnalytics, WebAnalyticsSchema } from "~/components/analytics/WebAnalytics";
import { ChangePasswordForm, ChangePasswordFormSchema } from "~/components/ChangePasswordForm";
import { MFAToggle, MFAToggleSchema } from "~/components/MFAToggle";
import { ProfileInformationCard, ProfileInformationCardSchema } from "~/components/ProfileInformationCard";
import { InteractableProfileInformationCard, ProfileInformationCardPropsSchema } from "~/components/ProfileInformationCard.interactable";
import { MetricCard, MetricSchema } from "~/components/analytics/MetricCard";
import { WebAnalyticsChartCard, WebAnalyticsChartCardSchema } from "~/components/analytics/WebAnalyticsChartCard";
import { WebAnalyticsRoutesTable, WebAnalyticsRoutesTableSchema } from "~/components/analytics/WebAnalyticsRoutesTable";
import {AddUserModal, formSchema} from "~/components/users/add-user-modal";
import { z } from "zod";
/**
 * Components Array - A collection of Tambo components to register
 * 
 * Components represent UI elements that can be generated or controlled by AI.
 * Register your custom components here to make them available to the AI.
 * 
 * Example of adding a component:
 * 
 * ```typescript
 * import { z } from "zod/v4";
 * import { CustomChart } from "../components/ui/custom-chart";
 * 
 * // Define and add your component
 * export const components: TamboComponent[] = [
 *   {
 *     name: "CustomChart",
 *     description: "Renders a custom chart with the provided data",
 *     component: CustomChart,
 *     propsSchema: z.object({
 *       data: z.array(z.number()),
 *       title: z.string().optional(),
 *     })
 *   }
 * ];
 * ```
 */
export const components: TamboComponent[] = [
  {
    name: 'DashboardAnalytics',
    description: 'Dashboard Web Analytics',
    component: WebAnalytics,
    propsSchema: WebAnalyticsSchema,
  },
  // {
  //   name: 'SuperAdminDashboard',
  //   description: 'Super Admin Dashboard',
  //   component: SuperAdminDashboardPage,
  //   propsSchema: SuperAdminDashboardSchema,
  // },
  {
    name: 'ChangePasswordForm',
    description: 'Change Password Form',
    component: ChangePasswordForm,
    propsSchema: ChangePasswordFormSchema,
  },
  {
    name: 'MFAToggle',
    description: 'Multi-Factor Authentication Toggle',
    component: MFAToggle,
    propsSchema: MFAToggleSchema,
  },
  {
    name: 'ProfileInformationCard',
    description: 'Profile Page use the tool update_profile_form to update the profile information',
    component: InteractableProfileInformationCard,
    propsSchema: ProfileInformationCardPropsSchema,
  },
  {
    name: 'DashboardMetricCard',
    description: 'To display the dashboard metrics card. Get data from the tool get_metrics_data',
    component: MetricCard,
    propsSchema: MetricSchema,
  },
  {
    name: 'DashboardChartCard',
    description: 'Dashboard Chart Card use the tool get_dashboard_analytics',
    component: WebAnalyticsChartCard,
    propsSchema: WebAnalyticsChartCardSchema,
  },
  {
    name: 'DashboardRoutesTable',
    description: 'Dashboard Routes Table',
    component: WebAnalyticsRoutesTable,
    propsSchema: WebAnalyticsRoutesTableSchema,
  },
  {
    name: "DataChart",
    description: "Displays data as a chart",
    component: WebAnalyticsChartCard,
    propsSchema: z.object({
      data: z.array(
        z.object({
          label: z.string().describe("Short label text, 1-3 words"),
          value: z.number().describe("Numeric value for the data point"),
        }),
      ),
      type: z.enum(["bar", "line", "pie"])
        .describe("Use bar for comparisons, line for trends, pie for proportions"),
    }),
  },
  {
    name: 'AddUser',
    description: 'Add User Modal with user name and email',
    component: AddUserModal,
    propsSchema: formSchema,
  },
];

// Import your custom components that utilize the Tambo SDK
