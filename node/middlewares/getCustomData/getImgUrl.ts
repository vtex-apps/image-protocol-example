/* eslint-disable no-await-in-loop */
import { parse } from 'querystring'

import { LogLevel } from '@vtex/api'

import { getAppPrioritySettings } from '../../utils'
import {
  POLYGON_PRIORITY_SETTING,
  CUSTOMER_CLASS_PRIORITY_SETTING,
} from '../../constants/index'

export async function getImgUrl(ctx: Context) {
  const {
    querystring,
    vtex: { logger },
    clients: { vbase, apps, customDataManager },
    state: { customerClass, polygons },
  } = ctx

  const queryString = parse(querystring)

  logger.log(
    {
      message: `Data received for customer class: ${customerClass} & polygons: ${polygons}`,
      detail: {
        ...queryString,
        customerClass,
        polygons,
      },
    },
    LogLevel.Info
  )

  let protocolData
  const protocolId = queryString.imageProtocolId as string

  if (customerClass && polygons) {
    const customerClassAndPolygonData = await customDataManager.getProtcolData(
      vbase,
      protocolId,
      {
        polygons,
        customerClass,
      }
    )

    protocolData = customerClassAndPolygonData

    if (!customerClassAndPolygonData) {
      const appId: string = process.env.VTEX_APP_ID as string
      const appSettings = await apps.getAppSettings(appId)

      const sortedPrioritySettings = getAppPrioritySettings(appSettings)

      let sortedPriorityData

      for (const priority of sortedPrioritySettings) {
        if (!sortedPriorityData) {
          // eslint-disable-next-line default-case
          switch (priority) {
            case CUSTOMER_CLASS_PRIORITY_SETTING:
              sortedPriorityData = await customDataManager.getProtcolData(
                vbase,
                protocolId,
                {
                  customerClass,
                }
              )
              break

            case POLYGON_PRIORITY_SETTING:
              sortedPriorityData = await customDataManager.getProtcolData(
                vbase,
                protocolId,
                {
                  polygons,
                }
              )
              break
          }
        }
      }

      protocolData = sortedPriorityData
    }
  }

  if (customerClass && !polygons) {
    protocolData = await customDataManager.getProtcolData(vbase, protocolId, {
      customerClass,
    })
  }

  if (polygons && !customerClass) {
    protocolData = await customDataManager.getProtcolData(vbase, protocolId, {
      polygons,
    })
  }

  logger.log(
    {
      message: `Protocol returned data for customer class: ${customerClass} & polygons: ${polygons}`,
      detail: protocolData,
    },
    LogLevel.Info
  )

  ctx.status = 200
  ctx.body = protocolData ?? { url: null, urlMobile: null, hrefImg: null }

  return protocolData
}
