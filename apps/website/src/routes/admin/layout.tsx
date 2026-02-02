import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/layout")({
  component: AdminLayout,
  beforeLoad: async () => {
    try {
      const session = await authClient.getSession({
        fetchOptions: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });

      if (!session.data?.user) {
        throw redirect({ to: "/" });
      }

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

function AdminLayout() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content mb-2">Admin Panel</h1>
        <p className="text-base-content/70">Manage users and shiba submissions</p>
      </div>

      <div className="tabs tabs-boxed mb-6">
        <Link to="/admin/stats" className="tab">
          {({ isActive }) => <span className={isActive ? "tab-active" : ""}>Overview</span>}
        </Link>
        <Link to="/admin/shibas" className="tab">
          {({ isActive }) => <span className={isActive ? "tab-active" : ""}>Shiba Management</span>}
        </Link>
        <Link to="/admin/users" className="tab">
          {({ isActive }) => <span className={isActive ? "tab-active" : ""}>User Management</span>}
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
