import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { getDb } from "@shared/database/helpers";
import { userV2 } from "@shared/database/schemas";
import { desc, like } from "drizzle-orm";
import { z } from "zod";

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  try {
    // Check authentication and admin role
    const session = await auth.api.getSession({
      headers: {},
    });

    if (!session?.user?.id || (session.user as any).role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    const input = await z
      .object({
        search: z.string().optional(),
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(50),
      })
      .parseAsync({});

    const { search, page, limit } = input;
    const offset = (page - 1) * limit;

    console.log("STUB: Get users list", { search, page, limit, requestedBy: session.user.id });

    // Stubbed implementation - in real implementation would:
    const db = getDb();

    // Build query with optional search
    const baseQuery = db.select().from(userV2);
    const query = search ? baseQuery.where(like(userV2.name, `%${search}%`)) : baseQuery;

    const users = await query.orderBy(desc(userV2.createdAt)).limit(limit).offset(offset);

    // Get total count for pagination
    const baseCountQuery = db.select({ count: userV2.id }).from(userV2);
    const countQuery = search
      ? baseCountQuery.where(like(userV2.name, `%${search}%`))
      : baseCountQuery;
    const totalResult = await countQuery;
    const total = totalResult.length;

    return {
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get users error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get users");
  }
});
