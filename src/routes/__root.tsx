/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import * as React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TamboProvider } from "@tambo-ai/react";
import { components } from "~/lib/tambo";
import { MessageThreadCollapsible } from "~/components/ui/message-thread-collapsible";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import NProgress from "nprogress";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import "nprogress/nprogress.css";
import { tools } from "~/lib/tambo.tools";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Boilerplate Code",
        description: `Boilerplate Code`,
        keywords: "Boilerplate Code",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const prevPathnameRef = React.useRef("");
  const authStore = useAuthenticationStore();

  React.useEffect(() => {
    const currentPathname = routerState.location.pathname;
    const pathnameChanged = prevPathnameRef.current !== currentPathname;

    if (pathnameChanged && routerState.status === "pending") {
      NProgress.start();
      prevPathnameRef.current = currentPathname;
    }

    if (routerState.status === "idle") {
      NProgress.done();
    }
  }, [routerState.status, routerState.location.pathname]);

  const randomUserKey = Math.random().toString(36).substring(2, 15);

  return (
    <>
      <HeadContent />
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TamboProvider
          apiKey={import.meta.env.VITE_TAMBO_API_KEY ?? ""}
          components={components}
          userKey={authStore.user.id ?? randomUserKey}
          tools={tools}
        >
          <div className="min-h-screen bg-background">
            {/* <Header /> */}
            <main>{children}</main>
            {/* <Footer /> */}
          </div>
          <MessageThreadCollapsible />
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <Toaster />
        </TamboProvider>
      </ThemeProvider>
    </>
  );
}
