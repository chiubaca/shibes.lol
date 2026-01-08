import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

const routerInstance = router()

hydrateRoot(document, <RouterProvider router={routerInstance} />)