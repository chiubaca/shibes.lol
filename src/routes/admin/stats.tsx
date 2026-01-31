import { createFileRoute } from "@tanstack/react-router";
import { AdminStats } from "@/features/admin/screens/AdminStats";

export const Route = createFileRoute("/admin/stats")({
  component: StatsPage,
});

function StatsPage() {
  return <AdminStats />;
}
