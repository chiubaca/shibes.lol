import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2 } from "@/infrastructure/database/drizzle/schema";
import { auth } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";
import { makeImageUrl } from "@/lib/image";

const getMyShibas = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });

  if (!session?.user) {
    return { shibas: [], authenticated: false };
  }

  const db = getDb();
  const myShibas = await db
    .select({
      id: shibaSubmissionV2.id,
      imageRef: shibaSubmissionV2.imageRef,
      createdAt: shibaSubmissionV2.createdAt,
    })
    .from(shibaSubmissionV2)
    .where(eq(shibaSubmissionV2.userId, session.user.id))
    .orderBy(desc(shibaSubmissionV2.createdAt))
    .limit(100);

  return { shibas: myShibas, authenticated: true };
});

export const Route = createFileRoute("/my-shibas")({
  loader: () => getMyShibas(),
  head: () => ({
    meta: [
      { title: "my shibas | shibes.lol" },
      { name: "description", content: "view and manage your submitted shiba inu images" },
      { property: "og:title", content: "my shibas | shibes.lol" },
      { property: "og:description", content: "view and manage your submitted shiba inu images" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "shibes.lol" },
      { property: "og:url", content: "https://shibes.lol/my-shibas" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "my shibas | shibes.lol" },
      { name: "twitter:description", content: "view and manage your submitted shiba inu images" },
    ],
  }),
  component: MyShibasPage,
});

function MyShibasPage() {
  const { shibas, authenticated } = Route.useLoaderData();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!authenticated || !session) {
    return (
      <div className="h-16 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-white">Sign in to view your Shibas</h1>
            <p className="text-gray-400">You need to be signed in to see your submitted Shibas.</p>
            <Link
              to="/"
              className="rounded-lg bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="mb-2 inline-block text-sm text-amber-500 hover:text-amber-400">
              &larr; Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white">My Shibas</h1>
          </div>
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full"
              />
            )}
            <span className="text-white">{session.user.name}</span>
          </div>
        </div>

        {shibas.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <p className="text-lg text-gray-400">You haven't submitted any Shibas yet.</p>
            <Link
              to="/"
              className="rounded-lg bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600"
            >
              Submit your first Shiba
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-400">
              You have submitted {shibas.length} Shiba
              {shibas.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shibas.map((shiba) => (
                <div key={shiba.id} className="overflow-hidden rounded-lg bg-slate-800 shadow-lg">
                  <img
                    src={makeImageUrl(shiba.imageRef)}
                    alt={`Shiba submission ${shiba.id}`}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="text-xs text-gray-400">
                      {new Date(shiba.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
