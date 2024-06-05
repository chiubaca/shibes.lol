import { any, z } from "astro/zod";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";

import * as schema from "../../../../db/schema";
import { initialiseTwitterClient, initialiseLucia } from "../../../lib/lucia";

import type { APIContext } from "astro";

const twitterUserSchema = z.object({
  data: z.object({
    id: z.string(),
    name: z.string(), // twitter editable user name
    username: z.string(), // twitter handle
  }),
});

export async function GET(context: APIContext): Promise<Response> {
  console.log("TWITTER CALLBACK");

  const twitter = initialiseTwitterClient(context.locals.runtime.env);
  const lucia = initialiseLucia(context.locals.runtime.env.APP_DB);
  const db = drizzle(context.locals.runtime.env.APP_DB, { schema });
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("twitter_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    context.cookies.get("twitter_oauth_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await twitter.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const twitterUserResponse = await fetch(
      "https://api.twitter.com/2/users/me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    const unValidatedTwitterUser = await twitterUserResponse.json();

    const { data: twitterUser } = twitterUserSchema.parse(
      unValidatedTwitterUser
    );

    const existingUser = await db.query.userTable.findFirst({
      where: eq(schema.userTable.oauthId, twitterUser.id),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return context.redirect("/");
    }

    const userId = generateIdFromEntropySize(10);

    await db.insert(schema.userTable).values({
      id: userId,
      oauthId: twitterUser.id,
      authType: "twitter",
      avatarUrl: "https://ui-avatars.com/api/?name=" + twitterUser.name,
      userName: twitterUser.username,
      fullName: twitterUser.name,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return context.redirect("/");
  } catch (e) {
    console.log("🚀 ~ GET ~ e:", e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
