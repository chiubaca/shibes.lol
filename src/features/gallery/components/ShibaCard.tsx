import { Link } from "@tanstack/react-router";
import { makeImageUrl } from "@/lib/image";
import { Image } from "@unpic/react";

interface ShibaData {
  id: number;
  imageRef: string;
  imageWidth: number | null;
  imageHeight: number | null;
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

  const aspectRatio =
    shiba.imageWidth && shiba.imageHeight
      ? `${shiba.imageWidth} / ${shiba.imageHeight}`
      : undefined;

  return (
    <Link
      to="/shibe/$imgRef"
      params={{ imgRef: shiba.imageRef }}
      className="block relative rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-xl break-inside-avoid mb-4 group"
    >
      <div
        className="relative bg-slate-200 overflow-hidden"
        style={aspectRatio ? { aspectRatio } : { minHeight: "200px" }}
      >
        <Image
          src={makeImageUrl(shiba.imageRef)}
          alt={`Shiba by ${shiba.userName || "user"}`}
          layout="fullWidth"
          background="auto"
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3">
            {shiba.avatarUrl && (
              <img
                src={shiba.avatarUrl || "/placeholder.jpg"}
                alt={shiba.userName || "User"}
                className="h-10 w-10 rounded-full border-2 border-white/80"
              />
            )}
            <div>
              <p className="font-bold text-white">{shiba.userName}</p>
              <p className="text-xs text-white/70">
                {new Date(shiba.createdAt).toLocaleDateString("en-US", dateFormat)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
