import { createFileRoute } from "@tanstack/react-router";

function AdminRoute() {
  return <div>Admin Page - Coming Soon</div>;
}

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});