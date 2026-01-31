import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2, userTable } from "@/infrastructure/database/drizzle/schema";
import { makeImageUrl } from "@/lib/image";
import { ShibaDetailScreen } from "@/features/gallery/screens/ShibaDetailScreen";

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

  return <ShibaDetailScreen allShibas={allShibas} imgRef={imgRef} />;
}
