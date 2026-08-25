import { redirect } from '@tanstack/react-router'
import { useAuthenticationStore } from '~/store/useAuthenticationStore'

export type UserRole = 'super_admin' | 'admin' | 'user' | 'guest'

export interface RouteGuardOptions {
  requiredRoles?: UserRole | UserRole[] | 'authenticated'
  redirectTo?: string
}

export function checkAuthAndRole(options: RouteGuardOptions) {
  const state = useAuthenticationStore.getState()
  
  if (!state.isAuthenticated) {
    throw redirect({
      to: '/auth/signin',
      search: { 
        redirect: window.location.pathname 
      }
    })
  }
  
  if (options.requiredRoles) {
    const userRole = state.user.role as UserRole
    const required = Array.isArray(options.requiredRoles) 
      ? options.requiredRoles 
      : [options.requiredRoles]
    
    if (userRole && !required.includes(userRole)) {
      const dashboardMap: Record<UserRole, string> = {
        super_admin: '/super_admin/dashboard',
        admin: '/admin/dashboard',
        user: '/user/dashboard',
        guest: '/'
      }
      
      throw redirect({
        to: dashboardMap[userRole] || options.redirectTo || '/'
      })
    }
  }
}
