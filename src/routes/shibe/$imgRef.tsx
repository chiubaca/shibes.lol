import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2, userTable } from "@/infrastructure/database/drizzle/schema";
import { ShibaCard } from "@/components/ShibaCard";
import { makeImageUrl } from "@/lib/image";

const getAllShibas = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const shibas = await db
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
    .limit(100);

  return shibas;
});

export const Route = createFileRoute("/shibe/$imgRef")({
  loader: () => getAllShibas(),
  head: ({ params }) => ({
    meta: [
      { title: "shiba image | shibes.lol" },
      { name: "description", content: "check out this adorable shiba inu submission" },
      { property: "og:title", content: "shiba image | shibes.lol" },
      { property: "og:description", content: "check out this adorable shiba inu submission" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "shibes.lol" },
      { property: "og:url", content: `https://shibes.lol/shibe/${params.imgRef}` },
      { property: "og:image", content: makeImageUrl(params.imgRef) },
      { property: "og:image:alt", content: "shiba inu submission" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "shiba image | shibes.lol" },
      { name: "twitter:description", content: "check out this adorable shiba inu submission" },
      { name: "twitter:image", content: makeImageUrl(params.imgRef) },
    ],
  }),
  component: ShibaPage,
});

function ShibaPage() {
  const allShibas = Route.useLoaderData();
  const { imgRef } = Route.useParams();

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
