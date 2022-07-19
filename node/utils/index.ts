/* eslint-disable no-await-in-loop */
import type { VBase } from '@vtex/api'

import {
  BUCKET,
  POLYGON_PRIORITY_SETTING,
  CUSTOMER_CLASS_PRIORITY_SETTING,
  CONFIG_PATH_CC,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_POLYGON,
} from '../constants'

export const parseQueryString = (queryString: string) => {
  const queries = queryString.split('&')
  const parsedQueryString: { [key: string]: string } = {}

  for (const item of queries) {
    const keyValue = item.split('=')

    parsedQueryString[keyValue[0]] = keyValue[1]
  }

  return parsedQueryString
}

export const protocolKeyGenerator = (
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

export const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

export const getAppPrioritySettings = (appSettings: any): string[] => {
  if (
    Object.prototype.hasOwnProperty.call(
      appSettings,
      POLYGON_PRIORITY_SETTING
    ) ||
    Object.prototype.hasOwnProperty.call(
      appSettings,
      CUSTOMER_CLASS_PRIORITY_SETTING
    )
  ) {
    return Object.keys(appSettings).sort((a, b) => {
      return appSettings[a] - appSettings[b]
    })
  }

  return [CUSTOMER_CLASS_PRIORITY_SETTING, POLYGON_PRIORITY_SETTING]
}

export const getVbaseData = async (
  vbase: VBase,
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

export const getProtcolData = async (
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

        protocolData = await getVbaseData(vbase, protocolId, configPath, {
          customerClass: customerClassName,
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
