import { Link } from "@tanstack/react-router";
import { makeImageUrl } from "@/lib/image";
import { Image } from "@unpic/react";

interface ShibaData {
  id: number;
  imageRef: string;
  createdAt: string;
  userName: string | null;
  avatarUrl: string | null;
}

interface ShibaCardProps {
  shiba: ShibaData;
}

export function ShibaCard({ shiba }: ShibaCardProps) {
  const dateFormat = {
    weekday: "long" as const,
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
  };

  console.log(
    "🔍 ~ ShibaCard ~ src/features/gallery/components/ShibaCard.tsx:36 ~ shiba.avatarUrl:",
    shiba.avatarUrl,
  );
  return (
    <Link
      to="/shibe/$imgRef"
      params={{ imgRef: shiba.imageRef }}
      className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="p-4">
        <Image src={makeImageUrl(shiba.imageRef)} aspectRatio={1} layout="fullWidth" />
      </div>
      <div className="bg-white px-8 pt-4 pb-8">
        <div className="mb-3 flex items-center gap-3">
          {shiba.avatarUrl && (
            <img
              src={shiba.avatarUrl || "/placeholder.jpg"}
              alt={shiba.userName || "User"}
              className="h-16 w-16 rounded-full border-3 border-gray-300"
            />
          )}
          <div>
            <p className="text-xl font-bold text-gray-800">{shiba.userName}</p>
            <p className="text-sm text-gray-500">
              {new Date(shiba.createdAt).toLocaleDateString("en-US", dateFormat)}
            </p>
          </div>
        </div>
        {/* <div className="flex items-center gap-4 text-gray-600">
          <button
            type="button"
            className="flex items-center gap-2 transition-colors hover:text-red-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Like</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-medium">Like</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 transition-colors hover:text-blue-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Comment</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 transition-colors hover:text-green-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Share</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"
              />
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div> */}
      </div>
    </Link>
  );
}
