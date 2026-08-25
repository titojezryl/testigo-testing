import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '~/hooks/useAuth';
import { Button } from '~/components/ui/button';
import { TextField } from '~/components/ui/TextField';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { toast } from 'sonner';

export function CreateAccountPage() {
  const navigate = useNavigate();
  const { signUp, signUpForm, setSignUpForm, loading, signUpFormError, setSignUpFormError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signUpForm.password && signUpForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await signUp();
      navigate({ to: '/user/dashboard' });
    } catch (err: any) {
      // toast.error(err?.response?.data?.message || err?.message || 'Sign up failed. Please try again.');
      setSignUpFormError(err?.response?.data?.errors || {})
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <TextField
              id="first_name"
              label="First Name"
              type="text"
              placeholder="John Doe"
              value={signUpForm?.firstName || ''}
              error={signUpFormError.firstName}
              onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
            />
            <TextField
              id="last_name"
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={signUpForm?.lastName || ''}
              error={signUpFormError.lastName}
              onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={signUpForm.email || ''}
              error={signUpFormError?.email}
              onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
              required
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={signUpForm.password || ''}
              error={signUpFormError?.password}
              onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
              required
              minLength={6}
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={signUpForm.confirmPassword || ''}
              error={signUpFormError?.confirmPassword}
              onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
