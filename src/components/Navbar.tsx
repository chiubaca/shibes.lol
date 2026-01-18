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
    <div className=" navbar m-2 flex items-center justify-between">
      <h1 className="text-4xl font-bold text-white">shibes.lol</h1>
      <div>
        {isPending ? (
          <span className="mx-6 loading" />
        ) : session ? (
          <div className="bg-base-100 px-6 shadow-sm">
            <div className="flex-none">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn avatar btn-circle btn-ghost">
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
                  tabIndex={-1}
                  className="dropdown-content menu z-1 mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
                >
                  <li className="flex flex-row gap-2">
                    <Link to="/my-shibas" className="justify-between w-full">
                      My Shibas
                      <span className="badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <button type="button" onClick={handleSignOut}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3"></div>
        )}
      </div>
    </div>
  );
};
