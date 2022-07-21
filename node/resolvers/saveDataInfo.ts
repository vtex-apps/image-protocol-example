import { LogLevel } from '@vtex/api'

import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../constants/index'

export const saveDataInfo = async (
  _: unknown,
  args: CustomerInfoToSave,
  ctx: Context
) => {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  const { customerClassValue, polygon, url, urlMobile, hrefImg, idImg } = args

  logger.log(
    {
      message: 'In saveDataInfo.ts resolver. Args',
      detail: {
        data: { customerClassValue, idImg, polygon, hrefImg, url, urlMobile },
      },
    },
    LogLevel.Info
  )
  let key = ''
  let getCustomerList: Record<string, unknown> | null = null

  if (customerClassValue && polygon) {
    key = `${customerClassValue}-${polygon}-${idImg}`
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)
    logger.log(
      {
        message:
          'In saveDataInfo.ts resolver. If customer class and polygon have value. Get data from the bucket',
        detail: {
          data: {
            customerClassValue,
            polygon,
            CONFIG_PATH_CCPOLYGON,
            getCustomerList,
          },
        },
      },
      LogLevel.Info
    )

    if (!getCustomerList) {
      const customerUrls = {
        [key]: { url, urlMobile, hrefImg },
      }

      logger.log(
        {
          message:
            'In saveDataInfo.ts resolver. If customer class and polygon have value. No data returned from the bucket. Data saved',
          detail: {
            data: {
              customerClassValue,
              polygon,
              CONFIG_PATH_CCPOLYGON,
              customerUrls,
            },
          },
        },
        LogLevel.Info
      )

      await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, customerUrls)
    } else {
      getCustomerList[key] = { url, urlMobile, hrefImg }

      logger.log(
        {
          message:
            'In saveDataInfo.ts resolver. If customer class and polygon have value. Data returned from the bucket. Data saved',
          detail: {
            data: {
              customerClassValue,
              polygon,
              CONFIG_PATH_CCPOLYGON,
              getCustomerList,
            },
          },
        },
        LogLevel.Info
      )

      await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, getCustomerList)

      const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON)

      logger.log(
        {
          message:
            'In saveDataInfo.ts resolver. If customer class and polygon have value. Data saved',
          detail: {
            data: {
              customerClassValue,
              polygon,
              CONFIG_PATH_CCPOLYGON,
              resGetJsonAfter,
            },
          },
        },
        LogLevel.Info
      )

      return args
    }
  } else if (customerClassValue && !polygon) {
    key = `${customerClassValue}-${idImg}`
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)

    logger.log(
      {
        message:
          'In saveDataInfo.ts resolver. If only customer class has value. Data returned from the bucket.',
        detail: {
          data: {
            customerClassValue,
            CONFIG_PATH_CC,
            getCustomerList,
          },
        },
      },
      LogLevel.Info
    )

    if (!getCustomerList) {
      const customerUrls = {
        [key]: { url, urlMobile, hrefImg },
      }

      logger.log(
        {
          message:
            'In saveDataInfo.ts resolver. If only customer class has value.  No data returned from the bucket. Data saved',
          detail: {
            data: {
              customerClassValue,
              CONFIG_PATH_CC,
              customerUrls,
            },
          },
        },
        LogLevel.Info
      )
      await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, customerUrls)
    } else {
      getCustomerList[key] = { url, urlMobile, hrefImg }
      await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, getCustomerList)

      const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH_CC)

      logger.log(
        {
          message:
            'In saveDataInfo.ts resolver. If only customer class has value. Data returned from the bucket. Data saved',
          detail: {
            data: {
              customerClassValue,
              CONFIG_PATH_CC,
              getCustomerList,
              resGetJsonAfter,
            },
          },
        },
        LogLevel.Info
      )

      return args
    }
  } else if (polygon && !customerClassValue) {
    key = `${polygon}-${idImg}`
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)

    logger.log(
      {
        message:
          'In saveDataInfo.ts resolver. If only polygon has value. Data returned from the bucket.',
        detail: {
          data: {
            polygon,
            CONFIG_PATH_POLYGON,
            getCustomerList,
          },
        },
      },
      LogLevel.Info
    )

    if (!getCustomerList) {
      const customerUrls = {
        [key]: { url, urlMobile, hrefImg },
      }

      await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, customerUrls)

      logger.log(
        {
          message:
            'In saveDataInfo.ts resolver. If only polygon has value. No data returned from the bucket. Data saved',
          detail: {
            data: {
              polygon,
              CONFIG_PATH_POLYGON,
              customerUrls,
            },
          },
        },
        LogLevel.Info
      )
    } else {
      getCustomerList[key] = { url, urlMobile, hrefImg }
      await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, getCustomerList)

      const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON)

      logger.log(
        {
          message:
            'In saveDataInfo.ts resolver. If only polygon has value. Data returned from the bucket. Data saved',
          detail: {
            data: {
              polygon,
              CONFIG_PATH_POLYGON,
              getCustomerList,
              resGetJsonAfter,
            },
          },
        },
        LogLevel.Info
      )

      return args
    }
  }

  return args
}
