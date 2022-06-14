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

  let getCustomerList: Record<string, unknown> | null = null

  try {
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH)
    console.info('resGetJson: ', getCustomerList)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error: ', e)
  }

  if (!getCustomerList) {
    const customerUrls = {
      [key]: { url, urlMobile },
    }

    console.info('customer-imgId: urls: ', customerUrls)
    const resCustomerList = await vbase.saveJSON(
      BUCKET,
      CONFIG_PATH,
      customerUrls
    )

    console.info('list does not exist, resSaveJson', resCustomerList)
  } else {
    getCustomerList[key] = { url, urlMobile }
    const resSaveJson = await vbase.saveJSON(
      BUCKET,
      CONFIG_PATH,
      getCustomerList
    )

    console.info('savedJSON res: ', resSaveJson)

    const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH)

    console.info('getJSON res: ', resGetJsonAfter)

    return args
  }

  return args
}
