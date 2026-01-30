import { createFileRoute } from "@tanstack/react-router";
import { ShibaManagement } from "@/features/admin/screens/ShibaManagement";

export const Route = createFileRoute("/admin/shibas")({
  component: ShibasPage,
});

function ShibasPage() {
  return <ShibaManagement />;
}
