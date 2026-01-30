import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2 } from "@/infrastructure/database/drizzle/schema";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const deleteShiba = createServerFn({ method: 'POST' })
  .handler(async (ctx) => {
    const input = await z.object({
      imgRef: z.string(),
    }).parseAsync(ctx.data);

    try {
      // Check authentication and admin role
      const session = await auth.api.getSession({
        headers: {},
      });

      if (!session?.user?.id || (session.user as any).role !== 'admin') {
        throw new Error("Unauthorized - Admin access required");
      }

      const { imgRef } = input;

      console.log('STUB: Delete shiba', { imgRef, deletedBy: session.user.id });
      
      // Stubbed implementation - in real implementation would:
      // 1. Get R2 bucket from environment
      const R2_BUCKET = env.SHIBES_R2_BUCKET;
      
      // 2. Delete from R2 storage
      await R2_BUCKET.delete(imgRef);
      
      // 3. Delete from database
      const db = getDb();
      await db
        .delete(shibaSubmissionV2)
        .where(eq(shibaSubmissionV2.imageRef, imgRef));

      // Log the admin action
      console.log(`Admin ${session.user.id} deleted shiba ${imgRef}`);

      return {
        success: true,
        message: `Shiba ${imgRef} deleted successfully`,
        deleted: true,
        imgRef
      };
    } catch (error) {
      console.error("Delete shiba error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to delete shiba");
    }
  });