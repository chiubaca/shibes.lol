import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";

import type { APIRoute } from "astro";
import { shibaSubmission } from "../../../db/schema";
import { makeImageUrl } from "../../lib/bucket-access";

export const GET: APIRoute = async ({ request, locals }) => {
  const SERVER_API_SECRET = locals.runtime.env.API_SECRET;
  const CLIENT_SECRET = new URL(request.url).searchParams.get("CLIENT_SECRET");

  if (CLIENT_SECRET !== SERVER_API_SECRET) {
    return new Response("Unauthorised request", {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const APP_DB = locals.runtime.env.APP_DB;
  const db = drizzle(APP_DB);

  const randomShiba = (
    await db
      .select()
      .from(shibaSubmission)
      .orderBy(sql`RANDOM()`)
      .limit(1)
  )[0];

  const imgUrl = makeImageUrl(randomShiba.imageRef, "f=auto,q=80,h=500");

  const RESPONSE_TYPE = new URL(request.url).searchParams.get("type");
  if (RESPONSE_TYPE === "img") {
    return new Response(
      "<html><body><img src='" + imgUrl + "'></body></html>",
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  }

  return new Response(JSON.stringify({ img: imgUrl }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
