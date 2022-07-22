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

  public getPolygonById = (polygonId: string): Promise<PolygonDetail> =>
    this.http.get(this.routes.polygon(polygonId))

  public getListOfPolygons = (
    page = 1,
    perPage = 50
  ): Promise<PolygonsResponse> =>
    this.http.get(this.routes.polygons(), {
      params: {
        page,
        perPage,
      },
    })

  public getPolygonsCoordinates = async (): Promise<PolygonDetail[]> => {
    const { paging, items } = await this.getListOfPolygons()

    const polygonsDataPromises: any[] = []

    if (paging.pages > 1) {
      const pagePromises: any[] = []

      for (let index = 1; index < paging.pages; index++) {
        const polygonPagePromise = this.getListOfPolygons(index)

        pagePromises.push(polygonPagePromise)
      }

      const polygonsResponseData: PolygonsResponse[] = await Promise.all(
        pagePromises
      )

      for (const polygonDetail of polygonsResponseData) {
        for (const polygonId of polygonDetail.items) {
          const promise = this.getPolygonById(polygonId)

          polygonsDataPromises.push(promise)
        }
      }
    } else {
      for (const polygonId of items) {
        const promise = this.getPolygonById(polygonId)

        polygonsDataPromises.push(promise)
      }
    }

    const polygonsData = await Promise.all(polygonsDataPromises)

    return polygonsData
  }

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
