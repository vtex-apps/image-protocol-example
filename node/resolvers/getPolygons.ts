export const getPolygons = async (_: unknown, __: unknown, ctx: Context) => {
  const {
    clients: { logistics },
  } = ctx

  const listPolygons = await logistics.getListOfPolygons()

  console.info('list of Polygons: ', listPolygons.items)

  return {
    polygons: listPolygons.items,
  }
}
