import * as React from "react";
import { ChevronLeft, Menu } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useNavigation } from "~/hooks/useNavigation";
import { SidebarNavItem } from "./SidebarNavItem";
import { useNavigationItems } from "~/config/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isCollapsed, toggleCollapsed } = useNavigation();
  const navigationItems = useNavigationItems();

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-30 h-screen border-r bg-background/80 backdrop-blur-md transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "ml-auto h-8 w-8 transition-transform duration-300",
            isCollapsed ? "rotate-180" : ""
          )}
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-1 p-2">
        {navigationItems.map((item) => (
          <SidebarNavItem 
            key={item.href} 
            item={item} 
            isCollapsed={isCollapsed} 
          />
        ))}
      </div>
    </div>
  );
}
