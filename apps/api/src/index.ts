import { WorkerEntrypoint } from "cloudflare:workers";
import { App } from "./hono/app";
import { initDatabase } from "@shared/database/helpers";

export default class DataService extends WorkerEntrypoint<Env> {
  constructor(ctx: ExecutionContext, env: Env) {
    super(ctx, env);
    initDatabase(env.SHIBES_LOL_DB);
  }

  fetch(request: Request) {
    return App.fetch(request, this.env, this.ctx);
  }
}
