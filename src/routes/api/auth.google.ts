import { createFileRoute } from "@tanstack/react-router"
import { createServerFileRoute } from "@tanstack/react-start/server";
import { LuciaError } from "lucia";
import { auth } from "../../lib/lucia";
import { arctic } from "arctic";
import type { OAuthUser } from "../../types";

export const Route = createServerFileRoute("/api/auth/google")({
  GET: async ({ request, context }) => {
    const state = crypto.randomUUID();
    const url = await arctic.createAuthorizationURL(state, [
      "openid",
      "profile",
      "email",
    ]);

    context.cookies.set("google_oauth_state", state, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    return Response.redirect(url);
  },
});

export const CallbackRoute = createServerFileRoute("/api/auth/google/callback")({
  GET: async ({ request, context }) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = Object.fromEntries(
      cookieHeader?.split("; ").map((c) => c.split("=")) ?? []
    );
    
    const state = cookies.google_oauth_state;
    const code = new URL(request.url).searchParams.get("code");

    if (!state || !code) {
      return new Response("Invalid request", { status: 400 });
    }

    try {
      const tokens = await arctic.validateAuthorizationCode(code);
      const googleUser = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }).then((res) => res.json());

      const existingUser = await getGoogleUser(googleUser.id);
      let user = existingUser;

      if (!existingUser) {
        user = await createUser({
          id: crypto.randomUUID(),
          googleId: googleUser.id,
          userName: googleUser.email,
          avatarUrl: googleUser.picture,
          role: "user",
        });
      }

      const session = await auth.createSession({
        userId: user.id,
        attributes: {},
      });

      const sessionCookie = auth.createSessionCookie(session.id);

      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return Response.redirect(new URL("/", request.url).toString());
    } catch (e) {
      if (e instanceof LuciaError && e.message === "AUTH_INVALID_REQUEST") {
        return new Response("Invalid request", { status: 400 });
      }
      return new Response("An unknown error occurred", { status: 500 });
    }
  },
});

async function getGoogleUser(googleId: string) {
  // TODO: Implement user lookup from database
  return null;
}

async function createUser(userData: Partial<OAuthUser>) {
  // TODO: Implement user creation in database
  return userData as OAuthUser;
}