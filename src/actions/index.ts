import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/d1";
import { defineAction, z } from "astro:actions";

import { shibaSubmission } from "../../db/schema";
import { bucketAccess } from "../lib/bucket-access";

import type { ShibaSubmission } from "../types";

export const server = {
  submitShiba: defineAction({
    accept: "form",
    input: z.object({
      imageFile: z.instanceof(File),
      creditsUrl: z.string().url().nullable(),
    }),
    handler: async (
      input,
      context
    ): Promise<
      | { type: "error"; message: string }
      | { type: "success"; data: ShibaSubmission }
    > => {
      const { locals } = context;
      const user = locals.user;

      if (!user) {
        return { type: "error", message: "unauthorised" };
      }

      const APP_DB = locals.runtime.env.APP_DB;

      let imageRef: string | undefined;

      if (input.imageFile && input.imageFile.type.startsWith("image")) {
        const { putObject } = bucketAccess(context.locals.runtime.env);

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
          return { type: "error", message: "image upload error" };
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

      return { type: "success", data: resp[0] };
    },
  }),
};
