import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { cn } from "~/lib/utils";
import { LayoutDashboard, ChevronLeft, ChevronRight, FolderKanban, Users } from "lucide-react";
import { DashboardBackground } from "~/components/DashboardBackground";
import { useMemo } from "react";
import { useNavigation } from "~/hooks/useNavigation";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    // Check authentication status - redirect to login if not authenticated
    // This check will be replaced by proper client-side authentication logic
  },
  component: DashboardLayout,
});

interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  /** If specified, item is only visible to users with these roles */
  roles?: string[];
}

const baseNavItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "User Management",
    href: "/dashboard/admin/users",
    icon: Users,
    roles: ["super_admin"],
  },
];

function DashboardLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { isCollapsed, isHydrated, toggleCollapsed } = useNavigation();
  const { user: currentUser, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/sign-in', search: { redirect: undefined } });
    }
  }, [isAuthenticated, navigate]);

  // Filter nav items based on user role
  const navItems = useMemo(() => {
    return baseNavItems.filter((item) => {
      // Show item if no roles restriction, or if user has one of the required roles
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      return currentUser?.role && item.roles.includes(currentUser.role);
    });
  }, [currentUser?.role]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] relative">
      <DashboardBackground />

      {/* Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-white/5 bg-background/30 backdrop-blur-md supports-backdrop-filter:bg-background/20 z-20 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex items-center p-4 pb-2",
            isCollapsed ? "justify-center" : "justify-end"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={toggleCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-4 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? currentPath === "/dashboard"
                : currentPath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                {!isCollapsed && (
                  <span className="animate-in fade-in duration-200 whitespace-nowrap overflow-hidden">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar - Hidden for now, can be enhanced later */}
      <div className="md:hidden">
        {/* Mobile navigation can be added here using Sheet component */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
