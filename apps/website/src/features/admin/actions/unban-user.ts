import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { getDb } from "@shared/database/helpers";
import { userV2 } from "@shared/database/schemas";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";

export const unbanUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { userId } = data;
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

      console.log("Unban user", { userId, unbannedBy: session.user.id });

      const db = getDb();
      await db
        .update(userV2)
        .set({
          banned: false,
          banReason: null,
          banExpires: null,
        })
        .where(eq(userV2.id, userId));

      // Log the admin action
      console.log(`Admin ${session.user.id} unbanned user ${userId}`);

      return {
        success: true,
        message: `User ${userId} unbanned successfully`,
      };
    } catch (error) {
      console.error("Unban user error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to unban user");
    }
  });
