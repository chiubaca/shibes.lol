import { generateCodeVerifier, generateState } from "arctic";
import { initialiseTwitterClient } from "../../../lib/lucia";

import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const twitter = initialiseTwitterClient(context.locals.runtime.env);
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await twitter.createAuthorizationURL(state, codeVerifier, {
    scopes: ["tweet.read", "users.read", "offline.access"],
  });
  console.log("🚀 ~ GET ~ url:", url)

  context.cookies.set("twitter_oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  context.cookies.set("twitter_oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
