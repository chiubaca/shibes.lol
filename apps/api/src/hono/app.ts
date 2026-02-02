import { Hono } from "hono";
import { getDb } from "@shared/database/helpers";
import { shibaSubmissionV2 } from "@shared/database/schemas";
import { sql } from "drizzle-orm";

export const App = new Hono<{ Bindings: Env }>();

App.get("/random", async (c) => {
  const db = getDb();
  const result = await db
    .select()
    .from(shibaSubmissionV2)
    .orderBy(sql`RANDOM()`)
    .limit(1)
    .get();

  if (!result) {
    return c.json({ error: "No shibas found" }, 404);
  }

  const imageUrl = `https://assets.shibes.lol/${result.imageRef}`;
  const imageRes = await fetch(imageUrl);
  const imageData = await imageRes.arrayBuffer();
  
  return c.body(imageData, 200, {
    "Content-Type": imageRes.headers.get("Content-Type") || "image/jpeg",
  });
});
