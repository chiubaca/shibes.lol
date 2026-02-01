import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/infrastructure/database/database";
import { shibaSubmissionV2, userTable } from "@/infrastructure/database/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const getShibasInput = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.coerce.number().default(20),
});

export const getShibas = createServerFn({ method: "GET" })
  .inputValidator(getShibasInput)
  .handler(async ({ data }) => {
    const db = getDb();
    const { cursor, limit } = data;
    const offset = cursor ? cursor : 0;

    const shibas = await db
      .select({
        id: shibaSubmissionV2.id,
        imageRef: shibaSubmissionV2.imageRef,
        imageWidth: shibaSubmissionV2.imageWidth,
        imageHeight: shibaSubmissionV2.imageHeight,
        createdAt: shibaSubmissionV2.createdAt,
        userName: userTable.userName,
        avatarUrl: userTable.avatarUrl,
      })
      .from(shibaSubmissionV2)
      .leftJoin(userTable, eq(shibaSubmissionV2.userId, userTable.id))
      .orderBy(desc(shibaSubmissionV2.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = shibas.length > limit;
    const nextCursor = hasMore ? offset + limit : undefined;

    return {
      shibas: shibas.slice(0, limit),
      nextCursor,
    };
  });
