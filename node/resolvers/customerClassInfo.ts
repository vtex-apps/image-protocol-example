import { BUCKET, CONFIG_PATH } from '../constants/index'

interface CustomerClassInfo {
  customerClassValue: string
  url: string
  urlMobile: string
  idImg: string
}

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

  let resGetJson: Record<string, unknown> | null = null

  try {
    resGetJson = await vbase.getJSON(BUCKET, CONFIG_PATH)
  } catch (e) {
    console.info('error:', e)
  }

  if (!resGetJson) {
    const customerUrls = {
      [key]: { url, urlMobile },
    }

    console.info('customer-imgId: urls: ', customerUrls)
    const resSaveJson = await vbase.saveJSON(BUCKET, CONFIG_PATH, customerUrls)

    console.info('list does not exist, resSaveJson', resSaveJson)
  } else {
    resGetJson[key] = { url, urlMobile }
    const resSaveJson = await vbase.saveJSON(BUCKET, CONFIG_PATH, resGetJson)

    console.info('savedJSON res: ', resSaveJson)

    const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH)

    console.info('getJSON res: ', resGetJsonAfter)

    return args
  }
}
