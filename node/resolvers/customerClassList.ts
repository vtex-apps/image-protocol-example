import { LogLevel } from '@vtex/api'

import { BUCKET, CONFIG_PATH } from '../constants/index'

export const customerClassList = async (
  _: unknown,
  __: unknown,
  ctx: Context
) => {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  let getCustomerList: Record<string, any>
  const responseVbase: Array<{
    customerClass: string
    imageProtocolId: string
    desktopUrl: string
    mobileUrl: string
  }> = []

  let keys: string[] = []

  try {
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH)
    console.info('resGetJson: ', getCustomerList)
    logger.log(
      {
        message: 'In customerClassList.ts, inside try vbase getCustomerList',
        detail: {
          data: getCustomerList,
        },
      },
      LogLevel.Info
    )

    if (getCustomerList) {
      keys = Object.keys(getCustomerList)
      console.info('entries: ', keys)

      keys.forEach((key) => {
        const [cc, id] = key.split('-')

        responseVbase.push({
          customerClass: cc,
          imageProtocolId: id,
          desktopUrl: getCustomerList[key].url,
          mobileUrl: getCustomerList[key].urlMobile,
        })
      })
    }

    console.info(responseVbase)
    logger.log(
      {
        message: 'In removeFromList.ts, inside try vbase getCustomerList',
        detail: {
          data: getCustomerList,
        },
      },
      LogLevel.Info
    )

    return responseVbase
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error: ', e)

    return responseVbase
  }
}
