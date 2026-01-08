import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

function LogoutRoute() {
  // This will be handled by a server action
  return null;
}

export const Route = createFileRoute("/logout")({
  loader: async ({ context }) => {
    // Clear session cookie
    context.cookie?.set("auth_session", "", {
      path: "/",
      expires: new Date(0),
    });
    
    throw redirect({ to: "/" });
  },
  component: LogoutRoute,
});