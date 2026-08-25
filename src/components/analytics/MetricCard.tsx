import { Card, CardContent } from "~/components/ui/card";
import { z } from "zod";

/**
 * Single metric schema
 */
export const MetricSchema = z.object({
  totalVisits: z.object({
  value: z.number(),
  label: z.string(),
  }),
  uniqueVisitors: z.object({
    value: z.number(),
    label: z.string(),
  }),
  avgResponseTime: z.object({
    value: z.number(),
    label: z.string(),
  }),
  totalLogins: z.object({
    value: z.number(),
    label: z.string(),
  }),
  failedLogins: z.object({
    value: z.number(),
    label: z.string(),
  }),
  failureRate: z.object({
    value: z.number(),
    label: z.string(),
  }),
  successRate: z.object({
    value: z.number(),
    label: z.string(),
  }),
});

/**
 * API response is an object with dynamic keys
 */

export type MetricCard = z.infer<typeof MetricSchema>;

export interface MetricCardProps {
  data?: MetricCard; // <-- accept raw API object
}

export function MetricCard({ data }: MetricCardProps) {
  if (!data) return null;

  // Convert object → array safely
  const metrics = Object.values(data);

  return (
    <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-1">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">
                {metric.value}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {metric.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
