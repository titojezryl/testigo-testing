import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Rocket, 
  Layers, 
  Zap, 
  Globe, 
  ArrowRight, 
  Code, 
  Server, 
  Database, 
  Shield,
  GitBranch,
  LayoutTemplate,
  Component,
  RefreshCw,
  Terminal
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const features = [
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "File-Based Routing",
      description: "TanStack Router's file-based routing makes navigation intuitive and type-safe",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Clean Architecture",
      description: "Clear separation between Routes, Components, Hooks, and API Services layers",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Type Safe",
      description: "End-to-end TypeScript with auto-generated route types and API contracts",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Static Deployment",
      description: "Deploy to Vercel, Netlify, or any static hosting provider",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Authentication Ready",
      description: "Built-in JWT authentication with token refresh and protected routes",
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "TanStack Query",
      description: "Powerful data fetching, caching, and synchronization out of the box",
    },
  ];

  const stack = [
    { name: "React", icon: <Component className="h-5 w-5" /> },
    { name: "TypeScript", icon: <Code className="h-5 w-5" /> },
    { name: "TanStack Router", icon: <LayoutTemplate className="h-5 w-5" /> },
    { name: "TanStack Query", icon: <Terminal className="h-5 w-5" /> },
    { name: "Tailwind CSS", icon: <RefreshCw className="h-5 w-5" /> },
    { name: "Radix UI", icon: <Shield className="h-5 w-5" /> },
  ];

  const layers = [
    {
      name: "Routes",
      description: "Client-side routing with TanStack Router",
      color: "from-blue-500 to-cyan-500",
      path: "src/routes/",
    },
    {
      name: "Components",
      description: "Reusable UI with Radix UI & Tailwind",
      color: "from-purple-500 to-pink-500",
      path: "src/components/",
    },
    {
      name: "Hooks",
      description: "Custom hooks bridging UI to APIs",
      color: "from-orange-500 to-red-500",
      path: "src/hooks/",
    },
    {
      name: "API Services",
      description: "Centralized HTTP client & service modules",
      color: "from-green-500 to-emerald-500",
      path: "src/api-services/",
    },
    {
      name: "External APIs",
      description: "Your backend API endpoints",
      color: "from-indigo-500 to-violet-500",
      path: "https://your-api.com",
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-4xl">
          <Badge variant="secondary" className="px-4 py-2">
            <Rocket className="mr-2 h-4 w-4" />
            Frontend-Only Architecture
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Modern React Starter
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              For Full-Stack Apps
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A production-ready frontend boilerplate with clean architecture, 
            TanStack Router & Query, and type-safe API integration. 
            Deploy anywhere in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth/signin">
              <Button size="lg" className="min-w-[140px]">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => window.open('https://github.com', '_blank')}
            >
              <Code className="mr-2 h-4 w-4" />
              View Source
            </Button>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 justify-center pt-8">
            {stack.map((item) => (
              <Badge key={item.name} variant="outline" className="gap-2">
                {item.icon}
                {item.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built with best practices and modern tooling
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Clean Architecture
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A layered architecture that scales with your application
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Layered Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {layers.map((layer, index) => (
                  <div key={layer.name} className="relative">
                    <div 
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-full bg-gradient-to-b ${layer.color} ${
                        index === layers.length - 1 ? 'rounded-b' : ''
                      } ${index === 0 ? 'rounded-t' : ''}`}
                    />
                    <div className="flex items-start gap-4 pl-6">
                      <div className={`flex-1 p-4 rounded-lg border bg-gradient-to-r ${layer.color} to-transparent bg-opacity-10`}>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{layer.name}</h3>
                          <Badge variant="secondary">{layer.path}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{layer.description}</p>
                      </div>
                    </div>
                    {index < layers.length - 1 && (
                      <div className="absolute left-[18px] bottom-0 transform translate-y-1/2">
                        <ArrowDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Flow Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Data flows seamlessly through each layer
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Data Flow Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    Query Pattern (Fetch)
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">1</Badge>
                      <span>User navigates to route</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">2</Badge>
                      <span>Component mounts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">3</Badge>
                      <span>Hook calls API service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">4</Badge>
                      <span>TanStack Query caches result</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">5</Badge>
                      <span>Data displayed in UI</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    Mutation Pattern (Write)
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">1</Badge>
                      <span>User submits form</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">2</Badge>
                      <span>Mutation triggered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">3</Badge>
                      <span>API call via service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">4</Badge>
                      <span>Queries invalidated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">5</Badge>
                      <span>UI auto-updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quick Start
            </h2>
            <p className="text-muted-foreground text-lg">
              Get up and running in minutes
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <p className="font-semibold">Clone the repository</p>
                    <code className="block mt-2 p-3 bg-muted rounded-md text-sm overflow-x-auto">
                      git clone https://github.com/your-repo/tanstack-starter.git
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <p className="font-semibold">Install dependencies</p>
                    <code className="block mt-2 p-3 bg-muted rounded-md text-sm overflow-x-auto">
                      cd tanstack-starter && npm install
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <p className="font-semibold">Configure environment variables</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Copy .env.example to .env and set your API endpoints
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Badge className="mt-1">4</Badge>
                  <div>
                    <p className="font-semibold">Start development server</p>
                    <code className="block mt-2 p-3 bg-muted rounded-md text-sm overflow-x-auto">
                      npm run dev
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardContent className="pt-12 pb-12 px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Start building your next project with a solid foundation. 
              Clean architecture, type safety, and modern tooling included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signin">
                <Button size="lg" className="min-w-[160px]">
                  Try Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Code className="mr-2 h-4 w-4" />
                Fork on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}
