import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2 } from "@/infrastructure/database/drizzle/schema";
import { auth } from "@/lib/auth";
import { MyShibasScreen } from "@/features/user/screens/MyShibasScreen";

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
  return <MyShibasScreen shibas={shibas} authenticated={authenticated} />;
}
