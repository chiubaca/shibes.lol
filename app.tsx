import {
  createRootRoute,
  createRoute,
  createRouter,
  createHistory,
  redirect,
} from "@tanstack/react-router";
import { z } from "zod";

// Root Layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

import { createHead } from "tanstack-start";

function RootLayout({ children }: { children: React.ReactNode }) {
  const head = createHead();
  
  return (
    <html lang="en">
      <head>
        {head()}
        <meta charSet="utf-8" />
        <link rel="icon" type="image/ico" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
        <meta name="description" content="best shibe images on the internet" />
        <meta name="author" content="Alex Chiu" />
        <meta
          name="keywords"
          content="shiba, shibes, dog photos, doge, doggo, dogs"
        />
        <title>shibes.lol</title>
      </head>
      <body className="relative">
        {children}
      </body>
    </html>
  );
}

// Index Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRoute,
});

function IndexRoute() {
  return (
    <div className="relative hero min-h-screen bg-base-200">
      <div className="bg-img"></div>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-semibold">submit your shibas</h1>
          <span className="flex justify-center items-center">
            <span>🙏</span>
            <p className="pt-6">
              <a
                className="link"
                href="https://twitter.com/ShibaEveryHour"
                target="_blank"
                rel="noopener noreferrer"
              >
                @ShibaEveryHour
              </a>{" "}
              needs your help to build a new archive of shibas!
              <a
                className="link hover:link-hover"
                href="https://twitter.com/chiubaca/status/1795816063835541854"
              >
                More info here
              </a>
              ...
            </p>
            <span>🙏</span>
          </span>
          <p className="pt-2">
            This collection will be used to keep ShibaEveryHour running!
          </p>
        </div>
      </div>
    </div>
  );
}

// Admin Route
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminRoute,
});

function AdminRoute() {
  return <div>Admin Page - Coming Soon</div>;
}

// Create router
export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, adminRoute]),
  history: createHistory(),
});

// Register router for TypeScript
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}