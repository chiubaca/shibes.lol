import { env } from "cloudflare:workers";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { initDatabase } from "@/infrastructure/database/database";

export default createServerEntry({
  fetch(request) {
    initDatabase(env.SHIBES_LOL_DB);
    return handler.fetch(request);
  },
});

export async function scheduled(_event: ScheduledEvent, _env: Env, _ctx: ExecutionContext) {
  console.log("hello world");
}
