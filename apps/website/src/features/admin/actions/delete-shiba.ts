import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { getDb } from "@shared/database/helpers";
import { shibaSubmissionV2 } from "@shared/database/schemas";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";

export const deleteShiba = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      imgRef: z.string(),
      dbId: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const { imgRef, dbId } = data;

    try {
      const req = getRequest();
      // Check authentication and admin role
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        throw new Error("Unauthorised - not logged in");
      }

      if (session.user.role !== "admin") {
        throw new Error("Unauthorized - Admin access required");
      }

      const R2_BUCKET = env.SHIBES_R2_BUCKET;

      await R2_BUCKET.delete(imgRef);

      const db = getDb();
      await db.delete(shibaSubmissionV2).where(eq(shibaSubmissionV2.id, dbId));

      console.log(`Admin ${session.user.id} deleted shiba ${imgRef}`);

      return {
        success: true,
        message: `Shiba ${imgRef} deleted successfully`,
        deleted: true,
        imgRef,
      };
    } catch (error) {
      console.error("Delete shiba error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to delete shiba");
    }
  });
