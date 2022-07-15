/* eslint-disable no-console */
import { BUCKET, CONFIG_PATH_CC } from '../constants/index'

function parseQueryString(queryString: string) {
  const queries = queryString.split('&')
  const parsedQueryString: { [key: string]: string } = {}

  for (const item of queries) {
    const keyValue = item.split('=')

    parsedQueryString[keyValue[0]] = keyValue[1]
  }

  return parsedQueryString
}

export async function getImgUrl(ctx: Context) {
  const {
    clients: { masterdata, vbase },
    req,
  } = ctx

  const queryString = req.url?.split('?')[1]

  const parsedQuery = parseQueryString(queryString as string)

  const aux: ClientMasterdataEntityType[] = await masterdata.searchDocuments({
    dataEntity: 'CL',
    where: `userId=${parsedQuery.userId}`,
    fields: ['customerClass'],
    pagination: { page: 1, pageSize: 10 },
  })

  // eslint-disable-next-line prefer-destructuring
  const customerClass = aux[0].customerClass

  const imgId = parsedQuery.imageProtocolId

  const key = `${customerClass}-${imgId}`

  let response

  try {
    const resVbase: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      CONFIG_PATH_CC
    )

    response = resVbase[key]

    if (response === undefined) {
      response = { url: null, urlMobile: null, hrefImg: null }
      ctx.status = 200
      ctx.body = response
    } else {
      ctx.status = 200
      ctx.body = response
    }

    return response

    // throw new Error('testing error on protocol')
  } catch (error) {
    response = { url: null, urlMobile: null, hrefImg: null }

    ctx.status = 404
    ctx.body = response

    return response
  }
}
