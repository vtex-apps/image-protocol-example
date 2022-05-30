/* eslint-disable no-console */
import { BUCKET, CONFIG_PATH } from '../constants/index'

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

  console.log('url: ', req.url?.split('?'))
  const queryString = req.url?.split('?')[1]
  // console.log('req: ', JSON.stringify(ctx.req, null, 4))

  const parsedQuery = parseQueryString(queryString as string)

  console.log('parsedQuery: ', parsedQuery)
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

  console.info('customerClass-imgId: ', key)
  try {
    const resVbase: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      CONFIG_PATH
    )

    const respUrls = resVbase[key]

    console.info('Urls: ', respUrls)

    ctx.status = 200
    ctx.body = respUrls

    return respUrls

    // throw new Error('testing error on protocol')
  } catch (error) {
    console.log('error: ', error)
    const respUrls = { url: null, urlMobile: null }

    ctx.status = 404
    ctx.body = respUrls

    return respUrls
  }
}
