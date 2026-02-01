import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ShibaCard } from "@/features/gallery/components/ShibaCard";
import { ImageUpload } from "@/features/gallery/components/ImageUpload";
import { signIn } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { useShibas } from "@/features/gallery/hooks/use-shibas";

interface HomeScreenProps {
  latestShibas: Array<{
    id: number;
    imageRef: string;
    imageWidth: number | null;
    imageHeight: number | null;
    createdAt: string;
    userName: string | null;
    avatarUrl: string | null;
  }>;
  session: any;
  submissionCount: number;
}

export function HomeScreen({ latestShibas, session, submissionCount }: HomeScreenProps) {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useShibas();

  const allShibas = data
    ? data.pages.flatMap((page) => page.shibas)
    : latestShibas;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSignInWith = (type: "google" | "twitter") => {
    signIn.social({
      provider: type,
      callbackURL: "/",
    });
  };

  return (
    <>
      <HeroSection
        submissionCount={submissionCount}
        isLoggedIn={!!session}
        signInWithGoogle={() => handleSignInWith("google")}
        signInWithTwitter={() => handleSignInWith("twitter")}
        onUploadSuccess={() => navigate({ to: "/", replace: true })}
      />

      <div className="mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 px-4 pb-8">
        {allShibas.map((shiba) => (
          <ShibaCard key={`${shiba.id}-${shiba.imageRef}`} shiba={shiba} />
        ))}
      </div>

      <div ref={ref} className="flex justify-center pb-8">
        {isFetchingNextPage && (
          <span className="loading loading-spinner loading-lg text-primary" />
        )}
        {!hasNextPage && allShibas.length > 0 && (
          <span className="text-base-content/50">No more shibas!</span>
        )}
      </div>
    </>
  );
}

const HeroSection = ({
  submissionCount,
  isLoggedIn,
  signInWithGoogle,
  signInWithTwitter,
  onUploadSuccess,
}: {
  submissionCount: number;
  isLoggedIn: boolean;
  signInWithGoogle: () => void;
  signInWithTwitter: () => void;
  onUploadSuccess?: () => void;
}) => {
  return (
    <div className="relative hero min-h-screen bg-base-200">
      <div className="absolute inset-0 bg-[url(/bg.jpg)] bg-cover bg-center blur-[2px] opacity-45"></div>
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
            <p className="font-mono mb-6 badge badge-success">
              {submissionCount - 1}+ shiba images submitted!
            </p>
          )}

          <p className="mb-6">
            This collection is used to keep{" "}
            <a
              className="link"
              href="https://x.com/ShibaEveryHour"
              target="_blank"
              rel="noopener noreferrer"
            >
              @ShibaEveryHour
            </a>{" "}
            running!
          </p>

          {!isLoggedIn ? (
            <div className="flex flex-col w-full border-opacity-50">
              <p className="pb-2">sign in to contribute*</p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className=" cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-100"
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
            <ImageUpload onUploadSuccess={onUploadSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};
