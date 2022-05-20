interface CustomerClassInfo {
  customerClassValue: string
  url: string
  urlMobile: string
  idImg: string
}

const BUCKET = 'imageprotocol'
const CONFIG_PATH = 'mappings'

export const customerClassInfo = async (
  _: unknown,
  args: CustomerClassInfo,
  ctx: Context
) => {
  const {
    clients: { vbase },
  } = ctx

  const { customerClassValue, url, urlMobile, idImg } = args
  const key = `${customerClassValue}-${idImg}`

  // eslint-disable-next-line no-console
  console.log('key', key, ' url: ', url, 'urlMobile: ', urlMobile)

  try {
    const resGetJson: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      CONFIG_PATH
    )

    console.info('before saving, getJSON res: ', resGetJson)
    resGetJson[key] = { url, urlMobile }
    const resSaveJson = await vbase.saveJSON(BUCKET, CONFIG_PATH, resGetJson)

    console.info('savedJSON res: ', resSaveJson)

    const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH)

    console.info('getJSON res: ', resGetJsonAfter)

    return args
  } catch (e) {
    return e
  }
}
