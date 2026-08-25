export interface ProtectedRouteConfig {
  roles?: ('super_admin' | 'admin' | 'user' | 'guest')[]
  authenticated?: boolean
}

export const PROTECTED_ROUTES: Record<string, ProtectedRouteConfig> = {
  '/super_admin/dashboard': { roles: ['super_admin'] },
  '/super_admin/analytics': { roles: ['super_admin'] },
  '/super_admin/users': { roles: ['super_admin'] },
  '/super_admin/settings': { roles: ['super_admin'] },
  '/super_admin/profile': { roles: ['super_admin'] },
  
  '/admin/dashboard': { roles: ['admin'] },
  '/admin/analytics': { roles: ['admin'] },
  '/admin/profile': { roles: ['admin'] },
  
  '/user/dashboard': { roles: ['user'] },
  '/user/profile': { roles: ['user'] },
  '/user/settings': { roles: ['user'] },
  '/user/analytics': { roles: ['user'] },
}
