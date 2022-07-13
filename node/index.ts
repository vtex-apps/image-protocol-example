import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import {
  errorHandler,
  getImgUrl,
  getUsersPolygon,
  getUserCustomerClass,
} from './middlewares'
import { customerClassInfo } from './resolvers/customerClassInfo'
import { getPolygons } from './resolvers/getPolygons'
import { customerClassList } from './resolvers/customerClassList'
import { removeFromList } from './resolvers/removeFromList'
import { Clients } from './clients'

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

const TIMEOUT_MS = 10000

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
    polygon: string | undefined
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
        customerClassInfo,
        removeFromList,
      },
      Query: {
        customerClassList,
        getPolygons,
      },
    },
  },
  routes: {
    getUrl: method({
      GET: [errorHandler, getUsersPolygon, getUserCustomerClass, getImgUrl],
    }),
  },
})
