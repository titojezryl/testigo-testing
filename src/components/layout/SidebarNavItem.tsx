import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { Tooltip } from "~/components/ui/tooltip";
import type { NavItem } from "~/config/navigation";
import { useAuth } from "~/hooks/useAuth";
import { useProtectedRoute } from "~/hooks/useRouteAuth";

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
}

export function SidebarNavItem({ item, isCollapsed }: SidebarNavItemProps) {
  useProtectedRoute();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate(); 
  const { logout } = useAuth();
  
  const isActive = item.exact 
    ? currentPath === item.href 
    : currentPath.startsWith(item.href);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  const content = item.isLogout ? (
    <button
      onClick={handleLogout}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 w-full text-left hover:bg-accent hover:text-accent-foreground cursor-pointer",
        isActive 
          ? "text-muted-foreground shadow-[0_0_10px_rgba(var(--primary),0.1)]" 
          : "text-muted-foreground",
        isCollapsed ? "justify-center" : ""
      )}
    >
      <item.icon className={cn("h-5 w-5", isCollapsed ? "" : "shrink-0")} />
      {!isCollapsed && <span>{item.title}</span>}
      {isCollapsed && (
        <span className="sr-only">{item.title}</span>
      )}
    </button>
  ) : (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
        isActive 
          ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]" 
          : "text-muted-foreground",
        isCollapsed ? "justify-center" : ""
      )}
    >
      <item.icon className={cn("h-5 w-5", isCollapsed ? "" : "shrink-0")} />
      {!isCollapsed && <span>{item.title}</span>}
      {isCollapsed && (
        <span className="sr-only">{item.title}</span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={item.title}>
        {content}
      </Tooltip>
    );
  }

  return content;
}
