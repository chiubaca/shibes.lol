import { Link } from "@tanstack/react-router";
import { ShibaCard } from "@/features/gallery/components/ShibaCard";

interface ShibaDetailScreenProps {
  allShibas: Array<{
    id: number;
    imageRef: string;
    createdAt: string;
    userName: string | null;
    avatarUrl: string | null;
  }>;
  imgRef: string;
}

export function ShibaDetailScreen({ allShibas, imgRef }: ShibaDetailScreenProps) {
  // Find the specific shiba by imgRef
  const shiba = allShibas.find((s) => s.imageRef === imgRef);

  if (!shiba) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Shiba not found</h1>
          <a
            href="/"
            className="rounded-lg bg-amber-500 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-600"
          >
            Back to Gallery
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <ShibaCard shiba={shiba} />

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Back to Gallery</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}