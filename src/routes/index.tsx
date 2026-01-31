import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2, userTable } from "@/infrastructure/database/drizzle/schema";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { HomeScreen } from "@/features/gallery/screens/HomeScreen";

const getPageData = createServerFn({ method: "GET" }).handler(async () => {
  const req = getRequest();
  const sessionPromise = auth.api.getSession({
    headers: req.headers,
  });

  const db = getDb();
  const latestShibasPromise = db
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

  const countPromise = db.select({ count: count(shibaSubmissionV2.id) }).from(shibaSubmissionV2);

  const [session, latestShibas, countResult] = await Promise.all([
    sessionPromise,
    latestShibasPromise,
    countPromise,
  ]);

  const submissionCount = countResult[0]?.count ?? 0;

  return { latestShibas, session, submissionCount };
});

export const Route = createFileRoute("/")({
  loader: () => getPageData(),
  params: {},
  head: () => ({
    meta: [
      { title: "shibes.lol" },
      { name: "description", content: "the definitive collection of shibes on the internet" },
      { property: "og:title", content: "shibes.lol" },
      {
        property: "og:description",
        content: "the definitive collection of shibes on the internet",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "shibes.lol" },
      { property: "og:url", content: "https://shibes.lol" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "shibes.lol" },
      {
        name: "twitter:description",
        content: "the definitive collection of shibes on the internet",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { latestShibas, session, submissionCount } = Route.useLoaderData();
  return (
    <HomeScreen latestShibas={latestShibas} session={session} submissionCount={submissionCount} />
  );
}
