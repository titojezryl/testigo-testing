import { LayoutDashboard, BarChart, Users, Settings, User, LogOut } from "lucide-react";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  isLogout?: boolean;
}

const commonNavItems = (role: string): NavItem[] => [
  {
    title: "Profile",
    href: `/${role}/profile`,
    icon: User,
  },
  {
    title: "Logout",
    href: "/",
    icon: LogOut,
    isLogout: true,
  }, 
]

const superAdminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/super_admin/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  // {
  //   title: "Analytics",
  //   href: "/super_admin/analytics",
  //   icon: BarChart,
  // },
  ...commonNavItems('super_admin'),
]

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  ...commonNavItems('admin'),
];

const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  ...commonNavItems('user'),
];

/**
 * Hook to get navigation items based on user role.
 * Must be called within a React component.
 */
export const useNavigationItems = (): NavItem[] => {
  const user = useAuthenticationStore((state) => state.user);
  
  if (user.role === 'super_admin') {
    return superAdminNavItems;
  }
  
  if (user.role === 'admin') {
    return adminNavItems;
  }

  if (user.role === 'user') {
    return userNavItems;
  }
  return commonNavItems('user');
};
