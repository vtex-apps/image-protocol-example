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
    vtex: { logger },
  } = ctx

  const { customerClassValue, url, urlMobile, idImg } = args
  const key = `${customerClassValue}-${idImg}`

  let getCustomerList: Record<string, unknown> | null = null

  try {
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH)
    console.info('resGetJson: ', getCustomerList)

    logger.info(`vbase getJson: ${getCustomerList}`)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error: ', e)

    logger.info(`vbase getJson, error: ${e}`)
  }

  if (!getCustomerList) {
    const customerUrls = {
      [key]: { url, urlMobile },
    }

    console.info('customer-imgId: urls: ', customerUrls)

    logger.info(`customer-imgId: urls: ${customerUrls}`)

    const resCustomerList = await vbase.saveJSON(
      BUCKET,
      CONFIG_PATH,
      customerUrls
    )

    // eslint-disable-next-line no-console
    console.info('list does not exist, resSaveJson', resCustomerList)

    logger.info(`there is no data saved yet, saving : ${customerUrls}`)
  } else {
    getCustomerList[key] = { url, urlMobile }
    const resSaveJson = await vbase.saveJSON(
      BUCKET,
      CONFIG_PATH,
      getCustomerList
    )

    // eslint-disable-next-line no-console
    console.info('savedJSON res: ', resSaveJson)

    logger.info(`data saved in vbase: ${resSaveJson}`)
    const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH)

    // eslint-disable-next-line no-console
    console.info('getJSON res: ', resGetJsonAfter)

    logger.info(`after data saved in vbase: ${resGetJsonAfter}`)

    return args
  }

  return args
}
