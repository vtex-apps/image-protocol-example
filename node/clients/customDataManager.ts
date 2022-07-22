import type { InstanceOptions, IOContext, VBase } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import {
  BUCKET,
  CONFIG_PATH_CC,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_POLYGON,
} from '../constants'

export default class CustomDataDataManager extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: ctx.authToken,
      },
    })
  }

  private protocolKeyGenerator = (
    protocolId: string,
    customerData: {
      customerClass?: string
      polygonId?: string
    } = {
      customerClass: undefined,
      polygonId: undefined,
    }
  ) => {
    const { customerClass, polygonId } = customerData

    if (customerClass && polygonId) {
      return `${customerClass}-${polygonId}-${protocolId}`
    }

    if (customerClass) return `${customerClass}-${protocolId}`

    return `${polygonId}-${protocolId}`
  }

  public getVbaseData = async (
    vbase: VBase,
    configPath: string,
    protocolData: {
      protocolId: string
      customerClass?: string
      polygonId?: string
    }
  ) => {
    const {
      polygonId,
      protocolId,
      customerClass: customerClassName,
    } = protocolData

    const bucketData: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      configPath,
      true
    )

    const bucketKey = this.protocolKeyGenerator(protocolId, {
      customerClass: customerClassName,
      polygonId,
    })

    return bucketData?.[bucketKey] ? bucketData[bucketKey] : null
  }

  public getProtcolData = async (
    vbase: VBase,
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
          const configPath = customerClassName
            ? CONFIG_PATH_CCPOLYGON
            : CONFIG_PATH_POLYGON

          // eslint-disable-next-line no-await-in-loop
          protocolData = await this.getVbaseData(vbase, configPath, {
            protocolId,
            customerClass: customerClassName,
            polygonId,
          })
        }
      }
    } else {
      protocolData = await this.getVbaseData(vbase, CONFIG_PATH_CC, {
        protocolId,
        customerClass: customerClassName,
      })
    }

    return protocolData
  }
}
