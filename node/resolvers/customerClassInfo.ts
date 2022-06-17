import { LogLevel } from '@vtex/api'

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

    logger.log(
      {
        message: 'In customerClassInfo.ts, inside try vbase getCustomerList',
        detail: {
          data: getCustomerList,
        },
      },
      LogLevel.Info
    )
  } catch (e) {
    console.info('error: ', e)

    logger.log(
      {
        message: 'In customerClassInfo.ts, inside catch',
        detail: {
          data: e,
        },
      },
      LogLevel.Error
    )
  }

  if (!getCustomerList) {
    const customerUrls = {
      [key]: { url, urlMobile },
    }

    console.info('customer-imgId: urls: ', customerUrls)

    logger.log(
      {
        message: 'In customerClassInfo.ts, customer-imgId: urls',
        detail: {
          data: customerUrls,
        },
      },
      LogLevel.Info
    )

    const resCustomerList = await vbase.saveJSON(
      BUCKET,
      CONFIG_PATH,
      customerUrls
    )

    // eslint-disable-next-line no-console
    console.info('list does not exist, resSaveJson', resCustomerList)

    logger.log(
      {
        message: 'In customerClassInfo.ts, there is no data saved yet',
        detail: {
          data: customerUrls,
        },
      },
      LogLevel.Info
    )
  } else {
    getCustomerList[key] = { url, urlMobile }
    const resSaveJson = await vbase.saveJSON(
      BUCKET,
      CONFIG_PATH,
      getCustomerList
    )

    // eslint-disable-next-line no-console
    console.info('savedJSON res: ', resSaveJson)

    logger.log(
      {
        message: 'In customerClassInfo.ts, data already saved in vbase:',
        detail: {
          data: resSaveJson,
        },
      },
      LogLevel.Info
    )

    const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH)

    // eslint-disable-next-line no-console
    console.info('getJSON res: ', resGetJsonAfter)

    logger.log(
      {
        message: 'In customerClassInfo.ts, after data saved in vbase:',
        detail: {
          data: resGetJsonAfter,
        },
      },
      LogLevel.Info
    )

    return args
  }

  return args
}
