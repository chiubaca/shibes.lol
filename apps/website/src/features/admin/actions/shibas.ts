import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { getDb } from "@shared/database/helpers";
import { shibaSubmissionV2, userV2 } from "@shared/database/schemas";
import { desc, like, eq, or } from "drizzle-orm";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";

const getShibasInput = z.object({
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(50),
});

export const getShibas = createServerFn({ method: "GET" })
  .inputValidator(getShibasInput)
  .handler(async ({ data }) => {
    const req = getRequest();
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        throw new Error("Unauthorised - not logged in");
      }

      if (session.user.role !== "admin") {
        throw new Error("Unauthorized - Admin access required");
      }

      const { search, page, limit } = data;
      const offset = (page - 1) * limit;

      const db = getDb();

      let shibasQuery = db
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
            banned: userV2.banned,
          },
        })
        .from(shibaSubmissionV2)
        .leftJoin(userV2, eq(shibaSubmissionV2.userId, userV2.id));

      if (search) {
        shibasQuery = (shibasQuery as any).where(
          or(like(userV2.name, `%${search}%`), like(shibaSubmissionV2.imageRef, `%${search}%`)),
        );
      }

      const shibas = await shibasQuery
        .orderBy(desc(shibaSubmissionV2.createdAt))
        .limit(limit)
        .offset(offset);

      let countQuery = db
        .select({ count: shibaSubmissionV2.id })
        .from(shibaSubmissionV2)
        .leftJoin(userV2, eq(shibaSubmissionV2.userId, userV2.id));

      if (search) {
        countQuery = (countQuery as any).where(
          or(like(userV2.name, `%${search}%`), like(shibaSubmissionV2.imageRef, `%${search}%`)),
        );
      }
      const totalResult = await countQuery;
      const total = totalResult.length;

      return {
        success: true,
        shibas,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Get shibas error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to get shibas");
    }
  });
