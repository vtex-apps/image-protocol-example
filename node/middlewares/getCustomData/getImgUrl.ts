/* eslint-disable vtex/prefer-early-return */
/* eslint-disable no-console */
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
    state: { customerClass, polygon },
  } = ctx

  const getVbaseProtcolData = async (
    configPath: string,
    protocolId: string,
    customerData: CustomerData
  ) => {
    const bucketKey = protocolKeyGenerator(protocolId, customerData)
    const bucketData: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      configPath,
      true
    )

    return bucketData?.[bucketKey] ? bucketData[bucketKey] : null
  }

  const queryString = parse(querystring)

  console.log('QUERYSTRING', queryString)
  console.log('CUSTOMERCLASS', customerClass)
  console.log('POLYGON', polygon)

  let protocolData
  const protocolId = String(queryString.imageProtocolId)

  if (customerClass && polygon) {
    const customerClassAndPolygon = await getVbaseProtcolData(
      CONFIG_PATH_CCPOLYGON,
      protocolId,
      { polygonId: polygon, customerClass }
    )

    protocolData = customerClassAndPolygon

    if (!customerClassAndPolygon) {
      // TODO: Check app preference -> Switch
      const customerClassProtocol = await getVbaseProtcolData(
        CONFIG_PATH_CC,
        protocolId,
        { customerClass }
      )

      console.log('CUSTOMERCLASSPRTOCOL', customerClassProtocol)

      protocolData = customerClassProtocol

      if (!customerClassProtocol) {
        const polygonProtocol = await getVbaseProtcolData(
          CONFIG_PATH_POLYGON,
          protocolId,
          { polygonId: polygon }
        )

        protocolData = polygonProtocol
      }
    }
  }

  if (customerClass && !polygon) {
    protocolData = await getVbaseProtcolData(CONFIG_PATH_CC, protocolId, {
      customerClass,
    })
  }

  if (polygon && !customerClass) {
    protocolData = await getVbaseProtcolData(CONFIG_PATH_POLYGON, protocolId, {
      polygonId: polygon,
    })
  }

  console.log('PRTOTOCOL DATA', protocolData)

  ctx.status = 200
  ctx.body = protocolData

  return protocolData
}
