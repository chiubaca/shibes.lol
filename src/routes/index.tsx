import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq } from "drizzle-orm";
import { ShibaCard } from "@/components/ShibaCard";
import { Navbar } from "@/components/Navbar";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2, userTable } from "@/infrastructure/database/drizzle/schema";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { signIn } from "@/lib/auth-client";

const getPageData = createServerFn({ method: "GET" }).handler(async () => {
  const req = getRequest();
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const db = getDb();
  const latestShibas = await db
    .select({
      id: shibaSubmissionV2.id,
      imageRef: shibaSubmissionV2.imageRef,
      createdAt: shibaSubmissionV2.createdAt,
      userName: userTable.userName,
      avatarUrl: userTable.avatarUrl,
    })

    .from(shibaSubmissionV2)
    .leftJoin(userTable, eq(shibaSubmissionV2.userId, userTable.id))
    .orderBy(desc(shibaSubmissionV2.createdAt))
    .limit(50);

  const [countResult] = await db
    .select({ count: count(shibaSubmissionV2.id) })
    .from(shibaSubmissionV2);

  const submissionCount = countResult?.count ?? 0;

  return { latestShibas, session, submissionCount };
});

export const Route = createFileRoute("/")({
  loader: () => getPageData(),
  component: App,
});

function App() {
  const { latestShibas, session, submissionCount } = Route.useLoaderData();

  const handleSignInWith = (type: "google" | "twitter") => {
    signIn.social({
      provider: type,
      callbackURL: "/",
    });
  };

  return (
    <>
      <Navbar />

      <HeroSection
        submissionCount={submissionCount}
        isLoggedIn={!!session}
        signInWithGoogle={() => handleSignInWith("google")}
        signInWithTwitter={() => handleSignInWith("twitter")}
      />

      <div className="mx-auto max-w-2xl space-y-8">
        {latestShibas.map((shiba) => (
          <ShibaCard key={shiba.id} shiba={shiba} />
        ))}
      </div>
    </>
  );
}

const HeroSection = ({
  submissionCount,
  isLoggedIn,
  signInWithGoogle,
  signInWithTwitter,
  // user,
}: {
  submissionCount: number;
  isLoggedIn: boolean;
  signInWithGoogle: () => void;
  signInWithTwitter: () => void;
  // user: any;
}) => {
  return (
    <div className="relative hero min-h-screen bg-base-200">
      <div className="bg-img"></div>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold leading-tight mb-8">
            The
            <br />
            <span className="font-serif tracking-tighter italic font-light">
              Definitive Collection
            </span>
            <br />
            of Shibas
          </h1>

          {submissionCount && (
            <p className="mb-6 badge badge-success">
              {submissionCount - 1}+ shiba images submitted!
            </p>
          )}

          <p className="mb-6">
            This collection is used to keep{" "}
            <a href="https://x.com/ShibaEveryHour" target="_blank" rel="noopener noreferrer">
              @ShibaEveryHour
            </a>
            running!
          </p>

          {!isLoggedIn ? (
            <div className="flex flex-col w-full border-opacity-50">
              <p className="pb-2">sign in to contribute*</p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-100"
              >
                Sign in with Google
              </button>
              <div className="divider">OR</div>
              <button
                type="button"
                onClick={signInWithTwitter}
                className="cursor-pointer justify-center flex items-center gap-2 rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-900"
              >
                Sign in with X
              </button>

              <p className="text-sm pt-4 italic font-thin">
                *by signing up you're agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link hover:link-hover"
                >
                  terms ↗
                </a>{" "}
                of this site
              </p>
            </div>
          ) : (
            // <ShibaUpload  user={user} />
            "Upload component goes here"
          )}
        </div>
      </div>
    </div>
  );
};
