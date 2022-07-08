// import type { ClientsConfig } from '@vtex/api'
import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { errorHandler, getImgUrl, getPolygonId } from './middlewares'
import { customerClassInfo } from './resolvers/customerClassInfo'
import { getPolygons } from './resolvers/getPolygons'
import { customerClassList } from './resolvers/customerClassList'
import { removeFromList } from './resolvers/removeFromList'
import { Clients } from './clients'
// import { status } from './middlewares/status'
// import { validate } from './middlewares/validate'

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
// const memoryCache = new LRUCache<string, any>({ max: 5000 })

// metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const TIMEOUT_MS = 10000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 0,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>

  interface ClientMasterdataEntityType {
    customerClass: string
    where: string
  }
  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  // interface State extends RecorderState {
  //   code: number
  // }
}

// Export a service that defines route handlers and client options.
export default new Service({
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
    getUrl: method({ GET: [errorHandler, getPolygonId, getImgUrl] }),
  },
})
