import { Link, useRouter } from "@tanstack/react-router";
import { signOut, useSession } from "@/lib/auth-client";

export const Navbar = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    await router.invalidate();
  };

  return (
    <nav className="navbar px-2 py-4">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-4xl font-bold text-base-content">
          shibes.lol
        </Link>
      </div>

      <div className="navbar-end px-2">
        {isPending ? (
          <span className="loading loading-spinner loading-md mx-6" />
        ) : session ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-circle btn-ghost avatar hover:border-2 hover:border-primary transition-all duration-200"
              aria-label="User menu"
            >
              <div className="w-10 rounded-full">
                <img
                  alt={session.user.name || "User"}
                  src={
                    session.user.image ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <Link to="/my-shibas" className="justify-between">
                  My Shibas
                  <span className="badge">New</span>
                </Link>
              </li>
              {/* Show admin link only for admin users */}
              {(session.user as any)?.role === 'admin' && (
                <li>
                  <Link to="/admin">
                    Admin Panel
                    <span className="badge badge-warning">Admin</span>
                  </Link>
                </li>
              )}
              <li>
                <button type="button" onClick={handleSignOut}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-3"></div>
        )}
      </div>
    </nav>
  );
};
