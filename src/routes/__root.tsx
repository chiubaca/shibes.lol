import { HeadContent, Scripts, createRootRouteWithContext, Link } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { Navbar } from "@/shared/components/Navbar";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "shibes.lol",
      },
      {
        name: "description",
        content: "best shibe images on the internet",
      },
      {
        name: "author",
        content: "alex chiu",
      },
      {
        name: "keywords",
        content: "shiba, shibes, dog photos, doge, doggo, dogs",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/ico",
        href: "/favicon.ico",
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="footer footer-center p-4 bg-base-200 text-base-content mt-auto">
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <p>footer lol |</p>
            <Link to="/privacy" className="link link-hover hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/terms" className="link link-hover hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-xs opacity-60">© 2025 shibes.lol</p>
        </footer>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
