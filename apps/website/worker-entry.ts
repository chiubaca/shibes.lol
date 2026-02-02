import { env } from "cloudflare:workers";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { initDatabase } from "@shared/database/helpers";

export default createServerEntry({
  fetch(request) {
    initDatabase(env.SHIBES_LOL_DB);
    return handler.fetch(request);
  },
});
