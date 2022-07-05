// import { LogLevel } from '@vtex/api'

import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../constants/index'

interface CustomerClassInfo {
  customerClassValue: string
  polygon: string
  url: string
  urlMobile: string
  hrefImg: string
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

  const { customerClassValue, polygon, url, urlMobile, hrefImg, idImg } = args

  console.info(
    'from resolver: customerClassValue: ',
    customerClassValue,
    '; idImg: ',
    idImg,
    '; polygon: ',
    polygon,
    '; href: ',
    hrefImg,
    '; url:',
    url,
    '; url mobile: ',
    urlMobile
  )
  let key = ''
  let getCustomerList: Record<string, unknown> | null = null

  if (customerClassValue && polygon) {
    key = `${customerClassValue}-${polygon}-${idImg}`
    console.info(key)
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)
    console.info('config path: ', CONFIG_PATH_CCPOLYGON)
    console.info('resGetJson: ', getCustomerList)

    if (!getCustomerList) {
      const customerUrls = {
        [key]: { url, urlMobile, hrefImg },
      }

      console.info('customerclass-polygon-imgId: urls: ', customerUrls)
      const resCustomerList = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_CCPOLYGON,
        customerUrls
      )

      // eslint-disable-next-line no-console
      console.info('list does not exist, resSaveJson', resCustomerList)
    } else {
      getCustomerList[key] = { url, urlMobile, hrefImg }
      const resSaveJson = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_CCPOLYGON,
        getCustomerList
      )

      // eslint-disable-next-line no-console
      console.info('savedJSON res: ', resSaveJson)
      const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON)

      // eslint-disable-next-line no-console
      console.info('getJSON res: ', resGetJsonAfter)

      return args
    }
  } else if (customerClassValue && !polygon) {
    key = `${customerClassValue}-${idImg}`
    console.info(key)
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)
    console.info('config path: ', CONFIG_PATH_CC)
    console.info('resGetJson: ', getCustomerList)

    if (!getCustomerList) {
      const customerUrls = {
        [key]: { url, urlMobile, hrefImg },
      }

      console.info('customerclass-imgId: urls: ', customerUrls)

      const resCustomerList = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_CC,
        customerUrls
      )

      // eslint-disable-next-line no-console
      console.info('list does not exist, resSaveJson', resCustomerList)
    } else {
      getCustomerList[key] = { url, urlMobile, hrefImg }
      const resSaveJson = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_CC,
        getCustomerList
      )

      // eslint-disable-next-line no-console
      console.info('savedJSON res: ', resSaveJson)
      const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH_CC)

      // eslint-disable-next-line no-console
      console.info('getJSON res: ', resGetJsonAfter)

      return args
    }
  } else if (polygon && !customerClassValue) {
    key = `${polygon}-${idImg}`
    console.info(key)
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)
    console.info('config path: ', CONFIG_PATH_POLYGON)
    console.info('resGetJson: ', getCustomerList)

    if (!getCustomerList) {
      const customerUrls = {
        [key]: { url, urlMobile, hrefImg },
      }

      console.info('polygon-imgId: urls: ', customerUrls)

      const resCustomerList = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_POLYGON,
        customerUrls
      )

      // eslint-disable-next-line no-console
      console.info('list does not exist, resSaveJson', resCustomerList)
    } else {
      getCustomerList[key] = { url, urlMobile, hrefImg }
      const resSaveJson = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_POLYGON,
        getCustomerList
      )

      // eslint-disable-next-line no-console
      console.info('savedJSON res: ', resSaveJson)
      const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON)

      // eslint-disable-next-line no-console
      console.info('getJSON res: ', resGetJsonAfter)

      return args
    }
  }

  return args
}
