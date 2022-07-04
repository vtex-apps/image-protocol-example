import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class LogisticsClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: ctx.authToken,
      },
    })
  }

  public getPolygonById = (polygonId: string) =>
    this.http.get(this.routes.polygon(polygonId))

  public getListOfPolygons = () => this.http.get(this.routes.polygons())

  private get routes() {
    return {
      root: () => '/api',
      polygon: (polygonId: string) =>
        `${this.routes.root()}/logistics/pvt/configuration/geoshape/${polygonId}`,
      polygons: () =>
        `${this.routes.root()}/logistics/pvt/configuration/geoshape`,
    }
  }
}
