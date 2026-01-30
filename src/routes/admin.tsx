import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminScreen } from "@/features/admin/screens/AdminScreen";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin")({
  component: AdminScreen,
  beforeLoad: async () => {
    try {
      const session = await authClient.getSession({
        fetchOptions: {
          headers: {
            // Ensure cookies are sent
            "Content-Type": "application/json",
          },
        },
      });

      if (!session.data?.user) {
        throw redirect({ to: "/" });
      }

      // Type assertion to access role property
      const user = session.data.user as any;
      if (user.role !== "admin") {
        throw redirect({ to: "/" });
      }
    } catch (error) {
      console.error("Admin access check failed:", error);
      throw redirect({ to: "/" });
    }
  },
});