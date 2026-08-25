import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <ShieldX className="h-16 w-16 mx-auto text-destructive mb-4" />
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/forbidden')({
  component: ForbiddenPage,
})
