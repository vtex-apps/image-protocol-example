import { parse } from 'querystring'

import { LogLevel } from '@vtex/api'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point, polygon } from '@turf/helpers'
import polygonArea from '@turf/area'

export async function getUsersPolygon(ctx: Context, next: () => Promise<void>) {
  const {
    querystring,
    vtex: { logger },
    clients: { logistics },
  } = ctx

  const queryString = parse(querystring)

  let currentPolygons: string[] | undefined

  if (
    queryString?.latitude !== 'undefined' &&
    queryString?.latitude.length !== 0 &&
    queryString?.longitude !== 'undefined' &&
    queryString?.longitude.length !== 0
  ) {
    const [latitude, longitude] = [
      Number(queryString.latitude),
      Number(queryString.longitude),
    ]

    const polygonsData = await logistics.getPolygonsCoordinates()

    logger.log(
      {
        message: `In getUsersPolygon, latitude and longitude:`,
        detail: {
          latitude,
          longitude,
        },
      },
      LogLevel.Info
    )

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

    logger.log(
      {
        message: `In getUsersPolygon, available polygons and current polygons:`,
        detail: {
          availablePolygons,
          currentPolygons,
        },
      },
      LogLevel.Info
    )
  }

  logger.log(
    {
      message: `In getUsersPolygon, latitude: ${queryString.latitude} and longitude: ${queryString.longitude} `,
      detail: {
        queryString,
      },
    },
    LogLevel.Info
  )
  ctx.state.polygons = currentPolygons
  await next()
}
