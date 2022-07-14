import { parse } from 'querystring'

import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point, polygon } from '@turf/helpers'
import polygonArea from '@turf/area'

export async function getUsersPolygon(ctx: Context, next: () => Promise<void>) {
  const {
    querystring,
    clients: { logistics },
  } = ctx

  const queryString = parse(querystring)

  let currentPolygons: string[] | undefined

  if (queryString.latitude && queryString.longitude) {
    const [latitude, longitude] = [
      Number(queryString.latitude),
      Number(queryString.longitude),
    ]

    const polygonsData = await logistics.getPolygonsCoordinates()

    const availablePolygons = polygonsData.filter((pol) =>
      booleanPointInPolygon(
        point([longitude, latitude]),
        polygon(pol.geoShape.coordinates)
      )
    )

    if (availablePolygons.length > 1) {
      availablePolygons.sort(
        (a, z) =>
          polygonArea(polygon(a.geoShape.coordinates)) -
          polygonArea(polygon(z.geoShape.coordinates))
      )
    }

    currentPolygons = availablePolygons.map((polygonData) => polygonData.name)
  }

  ctx.state.polygons = currentPolygons
  await next()
}
