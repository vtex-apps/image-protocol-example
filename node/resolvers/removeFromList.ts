import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../constants/index'

interface DataToDelete {
  customerClass: string
  polygon: string
  imageProtocolId: string
}

export const removeFromList = async (
  _: unknown,
  args: DataToDelete,
  ctx: Context
) => {
  const {
    clients: { vbase },
  } = ctx

  const { customerClass, polygon, imageProtocolId } = args

  console.info(
    'customerClass: ',
    customerClass,
    ' polygon: ',
    polygon,
    ' imagePorotocolId: ',
    imageProtocolId
  )
  let key = ''
  let getDataList: Record<string, unknown> = {}
  let entries: Record<string, unknown>

  if (customerClass.length > 0 && polygon.length > 0) {
    console.info(
      'customerClass: ',
      customerClass,
      ' and polygon: ',
      polygon,
      'polygon length: ',
      polygon.length
    )
    key = `${customerClass}-${polygon}-${imageProtocolId}`
    console.info('KEY TO DELETE: ', key)

    getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)
    console.info('resGetJson: ', getDataList)

    if (getDataList) {
      entries = Object.keys(getDataList)
        .filter((idx) => idx !== key)
        .reduce((obj, idx) => {
          return Object.assign(obj, {
            [idx]: getDataList[idx],
          })
        }, {})

      const savedCustomerList = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_CCPOLYGON,
        entries
      )

      console.info(
        'entries saved info after deleting: ',
        entries,
        ' savedCustomerList:',
        savedCustomerList
      )
    } else {
      console.info('any data found')

      return args
    }
  } else if (
    customerClass.length > 0 &&
    (!polygon ||
      polygon === undefined ||
      polygon === '' ||
      polygon.length === 0)
  ) {
    console.info('customerClass: ', customerClass)
    key = `${customerClass}-${imageProtocolId}`
    console.info('KEY TO DELETE: ', key)

    getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)
    console.info('resGetJson: ', getDataList)

    if (getDataList) {
      entries = Object.keys(getDataList)
        .filter((idx) => idx !== key)
        .reduce((obj, idx) => {
          return Object.assign(obj, {
            [idx]: getDataList[idx],
          })
        }, {})

      const savedCustomerList = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_CC,
        entries
      )

      console.info(
        'entries saved info after deleting: ',
        entries,
        ' savedCustomerList:',
        savedCustomerList
      )
    } else {
      console.info('any data found')

      return args
    }
  } else if (
    polygon.length > 0 &&
    (!customerClass ||
      customerClass === undefined ||
      customerClass === '' ||
      customerClass.length === 0)
  ) {
    console.info('polygon: ', polygon)
    key = `${polygon}-${imageProtocolId}`
    console.info('KEY TO DELETE: ', key)

    getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)
    console.info('resGetJson: ', getDataList)

    if (getDataList) {
      entries = Object.keys(getDataList)
        .filter((idx) => idx !== key)
        .reduce((obj, idx) => {
          return Object.assign(obj, {
            [idx]: getDataList[idx],
          })
        }, {})

      const savedCustomerList = await vbase.saveJSON(
        BUCKET,
        CONFIG_PATH_POLYGON,
        entries
      )

      console.info(
        'entries saved info after deleting: ',
        entries,
        ' savedCustomerList:',
        savedCustomerList
      )
    } else {
      console.info('any data found')

      return args
    }
  }

  return args
}
