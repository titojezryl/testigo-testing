import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '~/api-services';
import { SignInRequest, SignUpRequest, ResetPasswordRequest, UpdatePasswordRequest, User } from '~/api-services';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  isAuthenticated: () => [...authKeys.all, 'isAuthenticated'] as const,
};

// Hooks
export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User | null>({
    queryKey: authKeys.user(),
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const signInMutation = useMutation({
    mutationFn: (credentials: SignInRequest) => authService.signIn(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(authKeys.isAuthenticated(), true);
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (userData: SignUpRequest) => authService.signUp(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(authKeys.isAuthenticated(), true);
    },
    onError: (error) => {
      console.error('Sign up failed:', error);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.setQueryData(authKeys.isAuthenticated(), false);
      window.location.href = '/sign-in';
    },
    onError: (error) => {
      console.error('Sign out failed:', error);
      // Still clear local data even if server sign out fails
      queryClient.clear();
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.setQueryData(authKeys.isAuthenticated(), false);
      window.location.href = '/sign-in';
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (request: ResetPasswordRequest) => authService.resetPassword(request),
    onError: (error) => {
      console.error('Reset password failed:', error);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (request: UpdatePasswordRequest) => authService.updatePassword(request),
    onError: (error) => {
      console.error('Update password failed:', error);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      // Refetch user data to get updated email verification status
      refetch();
    },
    onError: (error) => {
      console.error('Email verification failed:', error);
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) => authService.resendVerificationEmail(email),
    onError: (error) => {
      console.error('Resend verification failed:', error);
    },
  });

  const signIn = (credentials: SignInRequest) => {
    return signInMutation.mutateAsync(credentials);
  };

  const signUp = (userData: SignUpRequest) => {
    return signUpMutation.mutateAsync(userData);
  };

  const signOut = () => {
    signOutMutation.mutate();
  };

  const resetPassword = (request: ResetPasswordRequest) => {
    return resetPasswordMutation.mutateAsync(request);
  };

  const updatePassword = (request: UpdatePasswordRequest) => {
    return updatePasswordMutation.mutateAsync(request);
  };

  const verifyEmail = (token: string) => {
    return verifyEmailMutation.mutateAsync(token);
  };

  const resendVerification = (email: string) => {
    return resendVerificationMutation.mutateAsync(email);
  };

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    verifyEmail,
    resendVerification,
    mutations: {
      signIn: signInMutation,
      signUp: signUpMutation,
      signOut: signOutMutation,
      resetPassword: resetPasswordMutation,
      updatePassword: updatePasswordMutation,
      verifyEmail: verifyEmailMutation,
      resendVerification: resendVerificationMutation,
    },
  };
}

export function useIsAuthenticated() {
  return useQuery({
    queryKey: authKeys.isAuthenticated(),
    queryFn: () => authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}