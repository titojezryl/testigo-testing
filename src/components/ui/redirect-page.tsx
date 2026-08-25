import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { cn } from "~/lib/utils"

interface RedirectPageProps {
  title?: string
  description?: string
  redirectUrl: string
  delay?: number
  className?: string
}

export function RedirectPage({
  title = "Redirecting...",
  description = "Please wait while we redirect you...",
  redirectUrl,
  delay = 0,
  className
}: RedirectPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = redirectUrl
    }, delay)

    return () => clearTimeout(timer)
  }, [redirectUrl, delay])

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    </div>
  )
}