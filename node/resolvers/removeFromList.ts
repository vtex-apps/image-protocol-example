import { LogLevel } from '@vtex/api'

import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../constants/index'

export const removeFromList = async (
  _: unknown,
  args: DataToDelete,
  ctx: Context
) => {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  const { customerClass, polygon, imageProtocolId } = args

  logger.log(
    {
      message: 'In removeFromList.ts resolver. Args',
      detail: {
        data: {
          customerClass,
          polygon,
          imageProtocolId,
        },
      },
    },
    LogLevel.Info
  )
  let key = ''
  let getDataList: Record<string, unknown> = {}
  let entries: Record<string, unknown>

  if (customerClass.length > 0 && polygon.length > 0) {
    key = `${customerClass}-${polygon}-${imageProtocolId}`

    getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)

    if (getDataList) {
      entries = Object.keys(getDataList)
        .filter((idx) => idx !== key)
        .reduce((obj, idx) => {
          return Object.assign(obj, {
            [idx]: getDataList[idx],
          })
        }, {})

      await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, entries)

      logger.log(
        {
          message:
            'In removeFromList.ts resolver. Key to delete. Data saved after deleting',
          detail: {
            data: {
              key,
              entries,
            },
          },
        },
        LogLevel.Info
      )
    } else {
      logger.log(
        {
          message:
            'In removeFromList.ts resolver. No data returned from bucket',
          detail: {
            data: {
              CONFIG_PATH_CCPOLYGON,
              getDataList,
            },
          },
        },
        LogLevel.Info
      )

      return args
    }
  } else if (
    customerClass.length > 0 &&
    (!polygon ||
      polygon === undefined ||
      polygon === '' ||
      polygon.length === 0)
  ) {
    key = `${customerClass}-${imageProtocolId}`

    getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)

    if (getDataList) {
      entries = Object.keys(getDataList)
        .filter((idx) => idx !== key)
        .reduce((obj, idx) => {
          return Object.assign(obj, {
            [idx]: getDataList[idx],
          })
        }, {})

      await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, entries)

      logger.log(
        {
          message:
            'In removeFromList.ts resolver. Key to delete. Data saved after deleting',
          detail: {
            data: {
              key,
              entries,
            },
          },
        },
        LogLevel.Info
      )
    } else {
      logger.log(
        {
          message:
            'In removeFromList.ts resolver. No data returned from bucket',
          detail: {
            data: {
              CONFIG_PATH_CCPOLYGON,
              getDataList,
            },
          },
        },
        LogLevel.Info
      )

      return args
    }
  } else if (
    polygon.length > 0 &&
    (!customerClass ||
      customerClass === undefined ||
      customerClass === '' ||
      customerClass.length === 0)
  ) {
    key = `${polygon}-${imageProtocolId}`

    getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)

    if (getDataList) {
      entries = Object.keys(getDataList)
        .filter((idx) => idx !== key)
        .reduce((obj, idx) => {
          return Object.assign(obj, {
            [idx]: getDataList[idx],
          })
        }, {})

      await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, entries)

      logger.log(
        {
          message:
            'In removeFromList.ts resolver. Key to delete. Data saved after deleting',
          detail: {
            data: {
              key,
              entries,
            },
          },
        },
        LogLevel.Info
      )
    } else {
      logger.log(
        {
          message:
            'In removeFromList.ts resolver. No data returned from bucket',
          detail: {
            data: {
              CONFIG_PATH_CCPOLYGON,
              getDataList,
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
