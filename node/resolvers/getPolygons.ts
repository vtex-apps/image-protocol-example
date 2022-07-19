import { LogLevel } from '@vtex/api'

export const getPolygons = async (_: unknown, __: unknown, ctx: Context) => {
  const {
    clients: { logistics },
    vtex: { logger },
  } = ctx

  const listPolygons = await logistics.getListOfPolygons()

  logger.log(
    {
      message: 'In getPolygons.ts resolver. List of Polygons',
      detail: {
        data: {
          listPolygons,
        },
      },
    },
    LogLevel.Info
  )

  return {
    polygons: listPolygons.items,
  }
}
