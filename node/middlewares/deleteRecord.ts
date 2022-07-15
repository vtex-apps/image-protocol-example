/* eslint-disable no-console */
import { json } from 'co-body'

import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../constants/index'

export async function deleteRecord(ctx: Context) {
  const {
    clients: { vbase },
  } = ctx

  const { customerClass, polygon, imgId } = await json(ctx.req)

  console.log('ctx.req.body: ', customerClass, polygon, imgId)

  let key = ''
  let getDataList: Record<string, unknown> = {}
  let entries: Record<string, unknown>

  if (customerClass.length > 0 && polygon.length > 0) {
    try {
      key = `${customerClass}-${polygon}-${imgId}`
      getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)
      console.log('inside first if', ' bucket: ', CONFIG_PATH_CCPOLYGON)
      console.log('getDataList[key]:', getDataList[key])
      if (getDataList) {
        entries = Object.keys(getDataList)
          .filter((idx) => idx !== key)
          .reduce((obj, idx) => {
            return Object.assign(obj, {
              [idx]: getDataList[idx],
            })
          }, {})
        if (getDataList[key]) {
          ctx.status = 200
          ctx.body = 'Record deleted'
        } else {
          ctx.status = 200
          ctx.body = 'Record not found'
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, entries)
      } else {
        ctx.status = 400
        ctx.body = 'No data saved'
      }
    } catch (e) {
      ctx.status = 404
      ctx.body = `error: ${e}`
    }
  } else if (
    customerClass.length > 0 &&
    (!polygon ||
      polygon === undefined ||
      polygon === '' ||
      polygon.length === 0)
  ) {
    try {
      key = `${customerClass}-${imgId}`
      getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)
      console.log('inside second if', ' bucket: ', CONFIG_PATH_CC)
      console.log('getDataList[key]:', getDataList[key])
      if (getDataList) {
        entries = Object.keys(getDataList)
          .filter((idx) => idx !== key)
          .reduce((obj, idx) => {
            return Object.assign(obj, {
              [idx]: getDataList[idx],
            })
          }, {})
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, entries)
        if (getDataList[key]) {
          ctx.status = 200
          ctx.body = 'Record deleted'
        } else {
          ctx.status = 200
          ctx.body = 'Record not found'
        }
      } else {
        ctx.status = 400
        ctx.body = 'No data saved'
      }
    } catch (e) {
      ctx.status = 404
      ctx.body = `error: ${e}`
    }
  } else if (
    polygon.length > 0 &&
    (!customerClass ||
      customerClass === undefined ||
      customerClass === '' ||
      customerClass.length === 0)
  ) {
    try {
      key = `${polygon}-${imgId}`
      getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)
      console.log('inside third if', ' bucket: ', CONFIG_PATH_POLYGON)
      console.log('getDataList[key]:', getDataList[key])
      if (getDataList) {
        entries = Object.keys(getDataList)
          .filter((idx) => idx !== key)
          .reduce((obj, idx) => {
            return Object.assign(obj, {
              [idx]: getDataList[idx],
            })
          }, {})
        if (getDataList[key]) {
          ctx.status = 200
          ctx.body = 'Record deleted'
        } else {
          ctx.status = 200
          ctx.body = 'Record not found'
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, entries)
      } else {
        ctx.status = 400
        ctx.body = 'No data saved'
      }
    } catch (e) {
      ctx.status = 404
      ctx.body = `error: ${e}`
    }
  } else {
    ctx.status = 400
    ctx.body = 'Required data is missing'
  }
}
