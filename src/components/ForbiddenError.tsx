import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "~/components/ui/card";

interface ForbiddenErrorProps {
  error?: any;
  title?: string;
  message?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
  showGoHome?: boolean;
  showGoBack?: boolean;
}

export function ForbiddenError({
  error,
  title = error?.error || "Access Denied",
  message = error?.message || "You don't have permission to access this resource. Please contact your administrator if you believe you should have access.",
  onGoBack,
  onGoHome,
  showGoHome = true,
  showGoBack = true,
}: ForbiddenErrorProps) {
  
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="text-center space-y-4">
          {/* Icon Container with soft background */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
            <ShieldAlert className="h-10 w-10 text-destructive" strokeWidth={1.5} />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </CardTitle>
            
            {/* Styled Status Code Pill */}
            {error?.statusCode && (
              <div className="flex justify-center">
                <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive ring-1 ring-inset ring-destructive/20">
                  Error {error.statusCode}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center mt-2">
          {showGoBack && (
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="w-full sm:w-auto sm:flex-1 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
          )}
          {showGoHome && (
            <Button
              onClick={handleGoHome}
              className="w-full sm:w-auto sm:flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}