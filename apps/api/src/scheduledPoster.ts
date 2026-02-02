import { sql } from "drizzle-orm";
import { getDb } from "@shared/database";
import { shibaSubmissionV2 } from "../../../packages/shared/database/schemas";
import { uploadToBlueSky } from "./scripts/uploadToBlueSky";
import { uploadToTwitter } from "./scripts/uploadToTwitter";
import { uploadToMastodon } from "./scripts/uploadToMastodon";



export async function postRandomShiba() {
  const imageRef = await getRandomShibaImageRef();
  if (!imageRef) {
    console.log("No shibas found in database");
    return;
  }

  const imageUrl = `https://assets.shibes.lol/${imageRef}`;
  console.log(`Posting shiba: ${imageUrl}`);

  const results = await Promise.allSettled([
    uploadToBlueSky(imageUrl),
    uploadToTwitter(imageUrl),
    uploadToMastodon(imageUrl),
  ]);

  const platforms = ["BlueSky", "Twitter", "Mastodon"];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Successfully posted to ${platforms[index]}`);
    } else {
      console.error(`Failed to post to ${platforms[index]}:`, result.reason);
    }
  });
}

async function getRandomShibaImageRef(): Promise<string | null> {
  const db = getDb();
  const result = await db
    .select({ imageRef: shibaSubmissionV2.imageRef })
    .from(shibaSubmissionV2)
    .orderBy(sql`RANDOM()`)
    .limit(1)
    .get();

  return result?.imageRef ?? null;
}
