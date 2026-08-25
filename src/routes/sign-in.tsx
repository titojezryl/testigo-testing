import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  LogIn,
  Eye,
  EyeOff,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "~/hooks/api";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string | undefined,
  }),
});

function RouteComponent() {
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const { signIn, mutations: { signIn: signInMutation } } = useAuth();
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log("Sign-in component mounted");
    return () => {
      console.log("Sign-in component unmounting");
    };
  }, []);

  const testimonials = [
    {
      quote:
        "SoundStation has become my go-to platform for sharing programming tutorials. The community engagement is incredible and the analytics help me create better content.",
      author: "Sofia Davis",
      role: "YouTube Tech Educator",
      initials: "SD",
    },
    {
      quote:
        "The platform's intuitive design and powerful features have helped me grow my developer audience by 300% in just 6 months.",
      author: "Marcus Chen",
      role: "Senior Developer at Meta",
      initials: "MC",
    },
    {
      quote:
        "Finally, a platform built specifically for tech content creators. The community tools and analytics are game-changing.",
      author: "Sarah Johnson",
      role: "DevOps Engineer",
      initials: "SJ",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInForm) => {
    setAuthError("");

    try {
      await signIn(data);
      // Redirect to specified URL or default to dashboard
      if (redirect) {
        window.location.href = redirect;
      } else {
        router.navigate({ to: "/dashboard" });
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Invalid email or password");
    }
  };

  return (
    <div className="container mx-auto relative min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <aside
        className="relative hidden h-full flex-col bg-gradient-to-br from-slate-50 to-red-50 dark:from-slate-900 dark:to-slate-800 p-12 text-slate-800 dark:text-white lg:flex border-r border-border overflow-hidden"
        aria-label="SoundStation branding and platform information"
        role="complementary"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/8 via-green-600/6 to-red-600/4 dark:from-green-600/6 dark:to-green-600/4" />
        <div className="absolute top-32 right-32 h-48 w-48 rounded-full bg-gradient-to-br from-red-400/15 to-orange-400/10 dark:from-red-400/12 dark:to-orange-400/8 blur-2xl animate-pulse" />
        <div className="absolute bottom-32 left-32 h-32 w-32 rounded-full bg-gradient-to-br from-orange-400/10 to-red-400/8 dark:from-green-400/8 dark:to-green-400/6 blur-xl" />

        <header className="relative z-20 flex items-center text-xl font-semibold">
          <h1 className="bg-gradient-to-r from-slate-800 via-red-700 to-orange-700 dark:from-white dark:via-red-50 dark:to-orange-50 bg-clip-text text-transparent font-bold">
            Tito Solutions
          </h1>
        </header>

        <main className="relative z-20 flex-1 flex flex-col justify-center">
          <div className="space-y-8 text-center">
            <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-slate-800 via-green-700 to-orange-700 dark:from-white dark:via-red-50 dark:to-orange-50 bg-clip-text text-transparent">
              Welcome back Titos
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg opacity-75">
              Continue building amazing solutions
            </p>
          </div>
        </main>

        <footer className="relative z-20 mt-auto opacity-60">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tito Solutions
            </p>
          </div>
        </footer>
      </aside>
      <div className="lg:p-8">
        <div className="mb-6 flex items-center justify-center space-x-6 text-xs text-muted-foreground lg:hidden">
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>50K+ Users</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Growing Fast</span>
          </div>
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight animate-fadeInUp">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground animate-fadeInUp animation-delay-100">
              Enter your email below to sign in to your account
            </p>
          </div>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  {authError && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                      <p className="text-sm text-destructive">{authError}</p>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            type="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            to="/"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              disabled={isLoading}
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              disabled={isLoading}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={signInMutation.isPending}
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-blue-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium"
                  >
                    {signInMutation.isPending && (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    )}
                    {signInMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Need an account? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
