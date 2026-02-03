import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
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
        Impact-Site-Verification: 3dfebbb3-db03-474d-be41-dc974eaf310a
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="footer p-10 bg-neutral text-neutral-content">
          <nav>
            <h6 className="footer-title lowercase">footer stuff lol</h6>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="link link-hover">
              terms
            </a>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              privacy
            </a>
            <a
              href="https://twitter.com/ShibaEveryHour"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              @ShibaEveryHour
            </a>
            <a
              href="https://twitter.com/chiubaca"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              @chiubaca
            </a>
            <a
              href="https://ko-fi.com/chiubaca"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              support me | kofi
            </a>
          </nav>
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
