import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import appStyles from "../styles.css?url";

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
      {
        name: "description",
        content: "best shibe images on the internet",
      },
      {
        name: "author",
        content: "Alex Chiu",
      },
      {
        name: "keywords",
        content: "shiba, shibes, dog photos, doge, doggo, dogs",
      },
      {
        title: "shibes.lol",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/ico",
        href: "/favicon.ico",
      },
      {
        rel: "stylesheet",
        href: appStyles,
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
      <body className="relative">
        {children}
        <Scripts />
      </body>
    </html>
  );
}