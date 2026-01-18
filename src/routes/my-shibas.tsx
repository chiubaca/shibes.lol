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
  component: MyShibasPage,
});

function MyShibasPage() {
  const { shibas, authenticated } = Route.useLoaderData();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!authenticated || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <h1 className="text-2xl font-bold text-white">Sign in to view your Shibas</h1>
            <p className="text-gray-400">You need to be signed in to see your submitted Shibas.</p>
            <Link
              to="/"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="text-amber-500 hover:text-amber-400 text-sm mb-2 inline-block">
              &larr; Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white">My Shibas</h1>
          </div>
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-white">{session.user.name}</span>
          </div>
        </div>

        {shibas.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <p className="text-gray-400 text-lg">You haven't submitted any Shibas yet.</p>
            <Link
              to="/"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              Submit your first Shiba
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              You have submitted {shibas.length} Shiba
              {shibas.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shibas.map((shiba) => (
                <div key={shiba.id} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={makeImageUrl(shiba.imageRef)}
                    alt={`Shiba submission ${shiba.id}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-400 text-xs">
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
