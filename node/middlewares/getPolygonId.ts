import { parse } from 'querystring'

export async function getPolygonId(ctx: Context, next: () => Promise<void>) {
  const { querystring } = ctx

  const queryString = parse(querystring)

  // if (!queryString.latitude || !queryString.longitude) {
  // }

  await next()
}
