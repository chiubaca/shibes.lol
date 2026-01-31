import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2 } from "@/infrastructure/database/drizzle/schema";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await auth.api.getSession({
            headers: request.headers,
          });

          if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "User not authenticated" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const formData = await request.formData();
          const file = formData.get("file") as File;

          if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (file.size > 5 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: "File size must be less than 5MB" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!file.type.startsWith("image/")) {
            return new Response(JSON.stringify({ error: "Only image files are allowed" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const imageRef = nanoid();
          const R2_BUCKET = env.SHIBES_R2_BUCKET;
          const arrayBuffer = await file.arrayBuffer();

          await R2_BUCKET.put(imageRef, arrayBuffer, {
            httpMetadata: {
              contentType: file.type,
            },
          });

          const db = getDb();
          const result = await db
            .insert(shibaSubmissionV2)
            .values({
              imageRef,
              userId: session.user.id,
            })
            .returning();

          return new Response(
            JSON.stringify({
              success: true,
              imageRef,
              submission: result[0],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (error) {
          console.error("Upload error:", error);
          return new Response(
            JSON.stringify({
              error: error instanceof Error ? error.message : "Upload failed",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
