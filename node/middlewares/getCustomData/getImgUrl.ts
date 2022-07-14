/* eslint-disable no-await-in-loop */
import { parse } from 'querystring'

import { LogLevel } from '@vtex/api'

import { protocolKeyGenerator } from '../../utils'
import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../../constants/index'

export async function getImgUrl(ctx: Context) {
  const {
    querystring,
    vtex: { logger },
    clients: { vbase, apps },
    state: { customerClass, polygons },
  } = ctx

  const getVbaseData = async (
    protocolId: string,
    configPath: string,
    customerData: {
      customerClass?: string
      polygonId?: string
    }
  ) => {
    const { polygonId, customerClass: customerClassName } = customerData
    const bucketData: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      configPath,
      true
    )

    const bucketKey = protocolKeyGenerator(protocolId, {
      customerClass: customerClassName,
      polygonId,
    })

    return bucketData?.[bucketKey] ? bucketData[bucketKey] : null
  }

  const getProtcolData = async (
    protocolId: string,
    customerData: {
      customerClass?: string
      polygons?: string[]
    }
  ) => {
    const {
      polygons: polygonsArray,
      customerClass: customerClassName,
    } = customerData

    let protocolData

    if (polygonsArray) {
      for (const polygonId of polygonsArray) {
        if (!protocolData) {
          const configPath = customerClass
            ? CONFIG_PATH_CCPOLYGON
            : CONFIG_PATH_POLYGON

          protocolData = await getVbaseData(protocolId, configPath, {
            customerClass,
            polygonId,
          })
        }
      }
    } else {
      const bucketData: Record<string, unknown> = await vbase.getJSON(
        BUCKET,
        CONFIG_PATH_CC,
        true
      )

      const bucketKey = protocolKeyGenerator(protocolId, {
        customerClass: customerClassName,
      })

      protocolData = bucketData?.[bucketKey] ? bucketData[bucketKey] : null
    }

    return protocolData
  }

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
    const customerClassAndPolygon = await getProtcolData(protocolId, {
      polygons,
      customerClass,
    })

    protocolData = customerClassAndPolygon

    if (!customerClassAndPolygon) {
      // TODO: Check app preference -> Switch

      // console.log(process.env.VTEX_APP_ID)
      // const appId: string = process.env.VTEX_APP_ID as string
      // const {
      //   customerClassPriority,
      //   polygonPriority,
      // } = await apps.getAppSettings(appId)

      // Priority Check
      const customerClassProtocol = await getProtcolData(protocolId, {
        customerClass,
      })

      protocolData = customerClassProtocol

      if (!customerClassProtocol) {
        const polygonProtocol = await getProtcolData(protocolId, { polygons })

        protocolData = polygonProtocol
      }
    }
  }

  if (customerClass && !polygons) {
    protocolData = await getProtcolData(protocolId, {
      customerClass,
    })
  }

  if (polygons && !customerClass) {
    protocolData = await getProtcolData(protocolId, { polygons })
  }

  logger.log(
    {
      message: `Protocol returned data for customer class: ${customerClass} & polygons: ${polygons}`,
      detail: protocolData,
    },
    LogLevel.Info
  )

  ctx.status = 200
  ctx.body = protocolData

  return protocolData
}
