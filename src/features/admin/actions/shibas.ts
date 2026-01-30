import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2 } from "@/infrastructure/database/drizzle/schema";
import { userV2 } from "@/infrastructure/database/drizzle/auth-schema";
import { desc, like, eq } from "drizzle-orm";
import { z } from "zod";

export const getShibas = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      // Check authentication and admin role
      const session = await auth.api.getSession({
        headers: {},
      });

      if (!session?.user?.id || (session.user as any).role !== 'admin') {
        throw new Error("Unauthorized - Admin access required");
      }

      const input = await z.object({
        search: z.string().optional(),
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(50),
      }).parseAsync({});

      const { search, page, limit } = input;
      const offset = (page - 1) * limit;

      console.log('STUB: Get shibas list', { search, page, limit, requestedBy: session.user.id });
      
      // Stubbed implementation - in real implementation would:
      const db = getDb();
      
      // Build query with optional search
      const baseQuery = db
        .select({
          id: shibaSubmissionV2.id,
          imageRef: shibaSubmissionV2.imageRef,
          userId: shibaSubmissionV2.userId,
          createdAt: shibaSubmissionV2.createdAt,
          author: {
            id: userV2.id,
            name: userV2.name,
            email: userV2.email,
            image: userV2.image,
            role: userV2.role,
            banned: userV2.banned
          }
        })
        .from(shibaSubmissionV2)
        .leftJoin(userV2, eq(shibaSubmissionV2.userId, userV2.id));
        
      const query = search 
        ? baseQuery.where(like(userV2.name, `%${search}%`))
        : baseQuery;
      
      const shibas = await query
        .orderBy(desc(shibaSubmissionV2.createdAt))
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const baseCountQuery = db
        .select({ count: shibaSubmissionV2.id })
        .from(shibaSubmissionV2)
        .leftJoin(userV2, eq(shibaSubmissionV2.userId, userV2.id));
        
      const countQuery = search 
        ? baseCountQuery.where(like(userV2.name, `%${search}%`))
        : baseCountQuery;
      const totalResult = await countQuery;
      const total = totalResult.length;

      return {
        success: true,
        shibas,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error("Get shibas error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to get shibas");
    }
  });