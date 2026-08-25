import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { Button, buttonVariants } from "./ui/button";
import {
  LogOut,
  Menu,
  Code,
  LayoutDashboard,
} from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import * as React from "react";
import { cn } from "~/lib/utils";
import { useAuth } from '~/hooks/useAuth';
import { useAuthenticationStore } from "~/store/useAuthenticationStore";


const dashboardLink = {
  title: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
};

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

export function Header() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthenticationStore();
  const { logout, loading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-8 flex h-14 items-center">
        <div className="mr-4 flex gap-16">

        </div>

        {/* Mobile menu */}
        {/* {isAuthenticated && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="pr-0 bg-background/80 backdrop-blur-md border-r border-border/50"
            >
              <div className="px-7 pt-8 h-full flex flex-col">
                <Link
                  to="/"
                  className="flex items-center space-x-2 mb-8"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Code className="h-6 w-6 text-primary shrink-0" />
                  <span className="font-semibold text-base bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent whitespace-nowrap leading-none">
                    Product Expert AI
                  </span>
                </Link>
                <nav className="flex flex-col gap-2">
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
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-transform",
                            isActive && "scale-110"
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        )} */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center gap-4">
            {loading ? (
              <div className="flex h-9 w-9 items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                  <UserAvatar
                        imageUrl={(user as any)?.image_url || null}
                        name={user?.name || null}
                        email={user?.email || null}
                        size="sm"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Account
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || ""}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  className={buttonVariants({ variant: "default" })}
                  to="/auth/signin"
                >
                  Sign In
                </Link>
              </>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
