import * as React from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { z } from "zod";

export const WebAnalyticsRoutesTableSchema = z.object({
  topPages: z.array(z.object({
    path: z.string(),
    count: z.number(),
  })),
})
export type WebAnalyticsRoutesTable = z.infer<typeof WebAnalyticsRoutesTableSchema>;

interface PageStat {
  path: string;
  count: number;
}

export interface WebAnalyticsRoutesTableProps {
  topPages?: PageStat[];
  leftTab: string;
  onLeftTabChange: (value: string) => void;
}

function TabsList({
  tabs,
  value,
  onValueChange,
  className,
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-0 rounded-lg border border-border bg-muted/50 p-0.5 text-muted-foreground",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function WebAnalyticsRoutesTable({
  topPages,
  leftTab,
  onLeftTabChange,
}: WebAnalyticsRoutesTableProps) {
  return (
    <div className="grid grid-cols-1">
      <Card>
        <CardHeader className="pb-3">
          <TabsList
            tabs={[
              // { value: "pages", label: "Pages" },
              { value: "routes", label: "Routes" },
              // { value: "hostnames", label: "Hostnames" },
            ]}
            value={leftTab}
            onValueChange={onLeftTabChange}
          />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-border py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Endpoint</span>
              <span>Route Usage</span>
            </div>
            {leftTab === "routes" &&
              topPages?.map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between border-b border-border/60 py-3 last:border-0"
                >
                  <span className="font-mono text-sm">{page.path || "/"}</span>
                  <span className="tabular-nums text-sm">{page.count}</span>
                </div>
              ))}
            {leftTab === "hostnames" && (
              <p className="py-4 text-sm text-muted-foreground">No hostname data.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

