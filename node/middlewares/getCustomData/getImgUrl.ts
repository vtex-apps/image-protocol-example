/* eslint-disable no-await-in-loop */
import { parse } from 'querystring'

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
    clients: { vbase },
    state: { customerClass, polygons },
  } = ctx

  const getVbaseProtcolData = async (
    configPath: string,
    protocolId: string,
    customerData: {
      customerClass?: string
      polygonId?: string
    }
  ) => {
    const { polygonId, customerClass: customerClassName } = customerData

    const bucketKey = protocolKeyGenerator(protocolId, {
      customerClass: customerClassName,
      polygonId,
    })

    const bucketData: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      configPath,
      true
    )

    return bucketData?.[bucketKey] ? bucketData[bucketKey] : null
  }

  const getPolygonProtocolData = async (
    configPath: string,
    protocolId: string,
    customerData: {
      polygons: string[]
      customerClass?: string
    }
  ) => {
    let polygonProtocolData
    const { polygons: polygonsArray } = customerData

    for (const polygonId of polygonsArray) {
      if (!polygonProtocolData) {
        const data = await getVbaseProtcolData(configPath, protocolId, {
          customerClass,
          polygonId,
        })

        polygonProtocolData = data || null
      }
    }

    return polygonProtocolData
  }

  const queryString = parse(querystring)

  let protocolData
  const protocolId = String(queryString.imageProtocolId)
  const polygonsAvailable = polygons && polygons?.length > 1

  if (customerClass && polygons) {
    const customerClassAndPolygon = await getPolygonProtocolData(
      CONFIG_PATH_CCPOLYGON,
      protocolId,
      { polygons, customerClass }
    )

    protocolData = customerClassAndPolygon

    if (!customerClassAndPolygon) {
      // TODO: Check app preference -> Switch
      const customerClassProtocol = await getVbaseProtcolData(
        CONFIG_PATH_CC,
        protocolId,
        { customerClass }
      )

      protocolData = customerClassProtocol

      if (!customerClassProtocol) {
        const polygonProtocol = await getPolygonProtocolData(
          CONFIG_PATH_POLYGON,
          protocolId,
          { polygons }
        )

        protocolData = polygonProtocol
      }
    }
  }

  if (customerClass && !polygonsAvailable) {
    protocolData = await getVbaseProtcolData(CONFIG_PATH_CC, protocolId, {
      customerClass,
    })
  }

  if (polygons && !customerClass) {
    protocolData = await getPolygonProtocolData(
      CONFIG_PATH_POLYGON,
      protocolId,
      { polygons }
    )
  }

  ctx.status = 200
  ctx.body = protocolData

  return protocolData
}
