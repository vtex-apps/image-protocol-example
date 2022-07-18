import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import {
  errorHandler,
  getImgUrl,
  getUsersPolygon,
  getUserCustomerClass,
} from './middlewares'

import { saveDataInfo } from './resolvers/saveDataInfo'
import { getPolygons } from './resolvers/getPolygons'
import { getDataList } from './resolvers/getDataList'
import { removeFromList } from './resolvers/removeFromList'
import { Clients } from './clients'

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const TIMEOUT_MS = 2000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 0,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  interface State extends RecorderState {
    customerClass: string | undefined
    polygons: string[] | undefined
  }

  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>

  interface ClientMasterdataEntityType {
    customerClass: string
    where: string
  }
}

// Export a service that defines route handlers and client options.
export default new Service<Clients, State, Context>({
  clients,
  graphql: {
    resolvers: {
      Mutation: {
        saveDataInfo,
        removeFromList,
      },
      Query: {
        getDataList,
        getPolygons,
      },
    },
  },
  routes: {
<<<<<<< HEAD
    getUrl: method({
      GET: [errorHandler, getUsersPolygon, getUserCustomerClass, getImgUrl],
    }),
=======
    getUrl: method({ GET: [errorHandler, getImgUrl] }),
<<<<<<< HEAD
    saveDataInfo: method({ POST: [saveInfo] }),
    deleteRecord: method({ DELETE: [deleteRecord] }),
>>>>>>> 8365036 (delete record middleware)
=======
    saveDataInfo: method({ POST: [errorHandler, saveInfo] }),
    deleteRecord: method({ DELETE: [errorHandler, deleteRecord] }),
>>>>>>> e7e701e (errorHandler)
  },
})
