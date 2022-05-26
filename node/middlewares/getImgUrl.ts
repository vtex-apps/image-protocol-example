/* eslint-disable no-console */
import { json } from 'co-body'

import { BUCKET, CONFIG_PATH } from '../constants/index'

export async function getImgUrl(ctx: Context) {
  const {
    clients: { masterdata, vbase },
    req,
  } = ctx

  const body = await json(req)

  console.log(body)

  const aux: ClientMasterdataEntityType[] = await masterdata.searchDocuments({
    dataEntity: 'CL',
    where: `userId=${body.userId}`,
    fields: ['customerClass'],
    pagination: { page: 1, pageSize: 10 },
  })

  console.info('customerClass ', aux[0].customerClass)
  // eslint-disable-next-line prefer-destructuring
  const customerClass = aux[0].customerClass

  const key = `${customerClass}-${body.imageProtocolId}`

  console.info('customerClass-imgId: ', key)
  try {
    const resVbase: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      CONFIG_PATH
    )

    console.info('vbase Response: ', resVbase)
    const respUrls = resVbase[key]

    console.info('Urls: ', respUrls)

    ctx.status = 200
    ctx.body = respUrls
  } catch (error) {
    throw error
  }
}
