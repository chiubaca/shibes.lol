import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { userV2 } from "@shared/database/schemas";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import { getDb } from "@shared/database/helpers";

export const banUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string(),
      reason: z.string().optional(),
      expiresAt: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { userId, expiresAt, reason } = data;
    try {
      const req = getRequest();
      // Check authentication and admin role
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user?.id || (session.user as any).role !== "admin") {
        throw new Error("Unauthorized - Admin access required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      console.log("STUB: Ban user", { userId, reason, expiresAt, bannedBy: session.user.id });

      // Stubbed implementation - in real implementation would:
      const db = getDb();
      await db
        .update(userV2)
        .set({
          banned: true,
          banReason: reason || "Banned by administrator",
          banExpires: expiresAt ? new Date(expiresAt) : null,
        })
        .where(eq(userV2.id, userId));

      // Log the admin action
      console.log(`Admin ${session.user.id} banned user ${userId} for reason: ${reason}`);

      return {
        success: true,
        message: `User ${userId} banned successfully`,
        banned: true,
        reason,
        expiresAt,
      };
    } catch (error) {
      console.error("Ban user error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to ban user");
    }
  });
