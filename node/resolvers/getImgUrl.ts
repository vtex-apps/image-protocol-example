const BUCKET = 'imageprotocol'
const CONFIG_PATH = 'mappings'

export const getImgUrl = async (
  _: unknown,
  { userId, imageProtocolId }: { userId: string; imageProtocolId: string },
  ctx: Context
) => {
  if (userId === '') {
    return ''
  }

  const {
    clients: { masterdata, vbase },
  } = ctx

  const aux: ClientMasterdataEntityType[] = await masterdata.searchDocuments({
    dataEntity: 'CL',
    where: `userId=${userId}`,
    fields: ['customerClass'],
    pagination: { page: 1, pageSize: 10 },
  })

  // eslint-disable-next-line prefer-destructuring
  const customerClass = aux[0].customerClass

  const key = `${customerClass}-${imageProtocolId}`

  console.info('customerClass-imgId: ', key)
  try {
    const resVbase: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      CONFIG_PATH
    )

    console.info('vbase Response: ', resVbase)
    const respUrls = resVbase[key]

    console.info('Urls: ', respUrls)

    return respUrls
  } catch (e) {
    return e
  }
}
