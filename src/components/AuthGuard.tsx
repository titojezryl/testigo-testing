import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthenticationStore } from '~/store/useAuthenticationStore'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: ('super_admin' | 'admin' | 'user' | 'guest')[]
  fallbackPath?: string
}

export function AuthGuard({ 
  children, 
  requiredRoles = [],
  fallbackPath = '/auth/signin' 
}: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthenticationStore()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ 
        to: fallbackPath
      })
      return
    }
    
    if (requiredRoles.length > 0 && user.role && !requiredRoles.includes(user.role as any)) {
      navigate({ to: '/forbidden' })
    }
  }, [isAuthenticated, user, requiredRoles, navigate, fallbackPath])
  
  if (!isAuthenticated || (requiredRoles.length > 0 && user.role && !requiredRoles.includes(user.role as any))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }
  
  return <>{children}</>
}
