import { initDatabase } from '@/infrastructure/database/database';
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import { env } from 'cloudflare:workers';

export default createServerEntry({
  
  fetch(request) {
		initDatabase(env.SHIBES_LOL_DB);
    return handler.fetch(request)
  },
})