import { LogLevel } from '@vtex/api'

import { BUCKET, CONFIG_PATH } from '../constants/index'

interface CustomerClassToDelete {
  customerClass: string
  imageProtocolId: string
}

export const removeFromList = async (
  _: unknown,
  args: CustomerClassToDelete,
  ctx: Context
) => {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  const { customerClass, imageProtocolId } = args
  const key = `${customerClass}-${imageProtocolId}`

  console.info('KEY TO DELETE: ', key)
  let getCustomerList: Record<string, unknown>
  let entries: Record<string, unknown>

  try {
    getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH)
    console.info('resGetJson: ', getCustomerList)

    logger.log(
      {
        message: 'In removeFromList.ts, inside try vbase getCustomerList',
        detail: {
          data: getCustomerList,
        },
      },
      LogLevel.Info
    )

    if (getCustomerList) {
      entries = Object.keys(getCustomerList)
        .filter((idx) => idx !== key)
        .reduce((obj, idx) => {
          return Object.assign(obj, {
            [idx]: getCustomerList[idx],
          })
        }, {})

      console.info('ENTRIES:', entries)
      const savedCustomerList = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH,
        entries
      )

      logger.log(
        {
          message:
            'In removeFromList.ts, inside try vbase savedCustomerList after deleting',
          detail: {
            data: savedCustomerList,
          },
        },
        LogLevel.Info
      )
      console.info('saved info after deleting: ', savedCustomerList)
    } else {
      console.info('any data found')

      return args
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error: ', e)

    logger.log(
      {
        message: 'In removeFromList.ts, inside catch',
        detail: {
          data: e,
        },
      },
      LogLevel.Error
    )
  }

  return args
}
