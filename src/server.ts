import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { initialiseLucia } from "./lib/lucia";
import { verifyRequestOrigin } from "lucia";

export default createStartHandler({
  createRouter: async () => {
    const router = (await import("./router")).router;
    return router;
  },
})(async (request, context) => {
  // Middleware logic
  if (request.method !== "GET") {
    const originHeader = request.headers.get("Origin");
    const hostHeader = request.headers.get("Host");
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return new Response(null, {
        status: 403,
      });
    }
  }

  const lucia = initialiseLucia(context.runtime.env.APP_DB);

  const cookieHeader = request.headers.get("Cookie");
  const sessionId = cookieHeader
    ?.split(";")
    .find((c) => c.trim().startsWith(lucia.sessionCookieName))
    ?.split("=")[1] ?? null;

  if (!sessionId) {
    context.user = null;
    context.session = null;
    return defaultStreamHandler(request, context);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
  }
  context.session = session;
  context.user = user as OAuthUser;
  
  return defaultStreamHandler(request, context);
});