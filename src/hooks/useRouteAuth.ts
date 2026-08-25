// In src/hooks/use-route-auth.ts
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";

export function useProtectedRoute() {
  const { isAuthenticated } = useAuthenticationStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/auth/signin' });
    }
  }, [isAuthenticated, navigate]);
  
  return { isAuthenticated };
}