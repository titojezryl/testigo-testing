import * as React from "react";
import { cn } from "~/lib/utils";
import { Sidebar } from "./Sidebar";
import { useNavigation } from "~/hooks/useNavigation";
import { Header } from "~/components/Header";
import { useAuth } from "~/hooks/api";
import { useEffect } from "react";
import { authService } from "~/api-services";
import { useNavigate } from "@tanstack/react-router";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { isCollapsed, isHydrated } = useNavigation();

  // Don't render layout until we've hydrated the collapsed state
  // This prevents layout shift on page load
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out z-0",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className={cn("w-full ", className)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
