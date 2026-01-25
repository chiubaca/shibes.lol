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
          // Check authentication
          const session = await auth.api.getSession({
            headers: request.headers,
          });

          if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "User not authenticated" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Read form data from request
          const formData = await request.formData();
          const file = formData.get("file") as File;

          if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Client-side validation
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

          // Generate unique key for the image
          // const fileExtension = file.name.split(".").pop() || "jpg";
          const imageRef = nanoid();
          console.log("🔍 ~ POST ~ src/routes/api/upload/route.ts:53 ~ imageRef:", imageRef);

          // Get R2 bucket from environment
          const R2_BUCKET = env.SHIBES_R2_BUCKET;
          console.log("🔍 R2_BUCKET available:", !!R2_BUCKET);

          // Upload file directly to R2
          const arrayBuffer = await file.arrayBuffer();
          console.log("🔍 File size:", arrayBuffer.byteLength, "bytes");
          console.log("🔍 File type:", file.type);
          console.log("🔍 Uploading with key:", imageRef);
          
          const obj = await R2_BUCKET.put(imageRef, arrayBuffer, {
            httpMetadata: {
              contentType: file.type,
            },
          });
          console.log("🔍 ~ POST ~ src/routes/api/upload/route.ts:61 ~ obj:", obj);
          
          // Verify the upload by trying to get the object
          try {
            const verification = await R2_BUCKET.head(imageRef);
            console.log("🔍 Verification head:", verification);
          } catch (verifyError) {
            console.error("🔍 Verification failed:", verifyError);
          }

          // Save to database
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
