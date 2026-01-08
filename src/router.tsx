import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ 
  routeTree,
  defaultPreloadStaleTime: 0,
  context: {
    // Define context shape for authentication
    user: null as OAuthUser | null,
    session: null as any | null,
  },
})

export function getRouter() {
  return router
}

export default router
export { router }

// Register types for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  
  interface StaticData {
    user?: OAuthUser | null;
    session?: any | null;
  }
}