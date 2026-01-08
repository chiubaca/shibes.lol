import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/d1";
import { createServerFn, z } from "@tanstack/react-start";

import { shibaSubmission, userTable } from "../../db/schema";
import { bucketAccess } from "../lib/bucket-access";

import type { ShibaSubmission } from "../types";
import { eq } from "drizzle-orm";
import type { AppLoadContext } from "vinxi";

export const submitShiba = createServerFn({ method: "POST" })
  .validator(
    z.object({
      imageFile: z.instanceof(File),
      creditsUrl: z.string().url().nullable(),
    })
  )
  .handler(async ({ input, context }) => {
    const { locals } = context as AppLoadContext;
    const user = locals.user;

    if (!user) {
      throw new Error("unauthorised");
    }

    if (user.role === "banned") {
      throw new Error(
        "you're banned from submitting shibas, sorry. contact https://twitter.com/chiubaca to dispute."
      );
    }

    const APP_DB = locals.runtime.env.APP_DB;

    let imageRef: string | undefined;

    if (input.imageFile && input.imageFile.type.startsWith("image")) {
      const { putObject } = bucketAccess(locals.runtime.env);

      try {
        const fileBuffer = await input.imageFile.arrayBuffer();
        imageRef = nanoid(20);

        await putObject({
          key: imageRef,
          body: fileBuffer as any,
          contentType: input.imageFile.type,
          metaData: {
            originalFileName: input.imageFile.name,
            source: input.creditsUrl || "unknown",
          },
        });
      } catch (error) {
        console.error("Unhandled error uploading image to bucket", error);
        throw new Error("image upload error");
      }
    }

    if (!imageRef) {
      throw new Error("Image ref was not generated");
    }

    const db = drizzle(APP_DB);
    const resp = await db
      .insert(shibaSubmission)
      .values({
        userId: user.id,
        imageRef: imageRef,
      })
      .returning();

    return resp[0];
  });

export const removeShiba = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number(),
      imgRef: z.string(),
    })
  )
  .handler(async ({ input, context }) => {
    const { locals } = context as AppLoadContext;
    const user = locals.user;

    if (user?.role !== "admin") {
      throw new Error("you are not authorised to perform this action");
    }

    const APP_DB = locals.runtime.env.APP_DB;
    const db = drizzle(APP_DB);

    await db.delete(shibaSubmission).where(eq(shibaSubmission.id, input.id));
    const { deleteObject } = bucketAccess(locals.runtime.env);
    await deleteObject({
      key: input.imgRef,
    });

    return { success: true };
  });

export const banUser = createServerFn({ method: "POST" })
  .validator(
    z.object({
      userId: z.string(),
    })
  )
  .handler(async ({ input, context }) => {
    const { locals } = context as AppLoadContext;
    const user = locals.user;

    if (user?.role !== "admin") {
      throw new Error("you are not authorized to perform this action");
    }

    const APP_DB = locals.runtime.env.APP_DB;
    const db = drizzle(APP_DB);

    try {
      await db
        .update(userTable)
        .set({
          role: "banned",
        })
        .where(eq(userTable.id, input.userId));

      return { success: true };
    } catch (error) {
      console.warn(`Error banning user ${input.userId}`, error);
      throw new Error("Failed to ban user");
    }
  });
