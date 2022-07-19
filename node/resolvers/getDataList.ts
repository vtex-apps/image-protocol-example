import { LogLevel } from '@vtex/api'

import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../constants/index'

interface DataArray {
  customerClass: string
  polygon: string
  imageProtocolId: string
  desktopUrl: string
  mobileUrl: string
  hrefImg: string
}

interface DataObject {
  url: string
  urlMobile: string
  hrefImg: string
}
export const getDataList = async (_: unknown, __: unknown, ctx: Context) => {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  let getCCPolygonData: Record<string, DataObject> = {}
  let getCCData: Record<string, DataObject> = {}
  let getPolygonData: Record<string, DataObject> = {}
  // let allData: Record<string, any> = {}

  const responseCCPolygonVbase: DataArray[] = []
  const responseCCVbase: DataArray[] = []
  const responsePolygonVbase: DataArray[] = []

  let keys: string[] = []

  getCCPolygonData = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)

  getCCData = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)

  getPolygonData = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)

  if (getCCPolygonData) {
    keys = Object.keys(getCCPolygonData)

    keys.forEach((key) => {
      const [cc, polygon, id] = key.split('-')

      responseCCPolygonVbase.push({
        customerClass: cc,
        polygon,
        imageProtocolId: id,
        desktopUrl: getCCPolygonData[key].url,
        mobileUrl: getCCPolygonData[key].urlMobile,
        hrefImg: getCCPolygonData[key].hrefImg,
      })
    })
    logger.log(
      {
        message: 'In getDataList.ts resolver. responseCCPolygonVbase ',
        detail: {
          data: {
            responseCCPolygonVbase,
          },
        },
      },
      LogLevel.Info
    )
  }

  if (getCCData) {
    keys = Object.keys(getCCData)

    keys.forEach((key) => {
      const [cc, id] = key.split('-')

      responseCCVbase.push({
        customerClass: cc,
        polygon: '',
        imageProtocolId: id,
        desktopUrl: getCCData[key].url,
        mobileUrl: getCCData[key].urlMobile,
        hrefImg: getCCData[key].hrefImg,
      })
    })
    logger.log(
      {
        message: 'In getDataList.ts resolver. responseCCVbase ',
        detail: {
          data: {
            responseCCVbase,
          },
        },
      },
      LogLevel.Info
    )
  }

  if (getPolygonData) {
    keys = Object.keys(getPolygonData)

    keys.forEach((key) => {
      const [polygon, id] = key.split('-')

      responsePolygonVbase.push({
        customerClass: '',
        polygon,
        imageProtocolId: id,
        desktopUrl: getPolygonData[key].url,
        mobileUrl: getPolygonData[key].urlMobile,
        hrefImg: getPolygonData[key].hrefImg,
      })
    })
    logger.log(
      {
        message: 'In getDataList.ts resolver. responsePolygonVbase ',
        detail: {
          data: {
            responsePolygonVbase,
          },
        },
      },
      LogLevel.Info
    )
  }

  const allData = [
    ...responseCCPolygonVbase,
    ...responseCCVbase,
    ...responsePolygonVbase,
  ]

  logger.log(
    {
      message: 'In getDataList.ts resolver. All data ',
      detail: {
        data: {
          allData,
        },
      },
    },
    LogLevel.Info
  )

  return allData
}
