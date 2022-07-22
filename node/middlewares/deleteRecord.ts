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

  let key = ''
  let getDataList: Record<string, unknown> = {}
  let entries: Record<string, unknown>

  const filter = (data: any, k: any) => {
    entries = Object.keys(data)
      .filter((idx) => idx !== k)
      .reduce((obj, idx) => {
        return Object.assign(obj, {
          [idx]: getDataList[idx],
        })
      }, {})

    return entries
  }

  if (customerClass.length > 0 && polygon.length > 0) {
    try {
      key = `${customerClass}-${polygon}-${imgId}`
      getDataList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)
      if (getDataList) {
        entries = filter(getDataList, key)
        if (getDataList[key]) {
          ctx.status = 200
          ctx.body = 'Record deleted'
        } else {
          ctx.status = 404
          ctx.body = 'Record not found'
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, entries)
      } else {
        ctx.status = 404
        ctx.body = 'No data saved'
      }
    } catch (e) {
      ctx.status = 500
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
      if (getDataList) {
        entries = filter(getDataList, key)
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, entries)
        if (getDataList[key]) {
          ctx.status = 200
          ctx.body = 'Record deleted'
        } else {
          ctx.status = 404
          ctx.body = 'Record not found'
        }
      } else {
        ctx.status = 404
        ctx.body = 'No data saved'
      }
    } catch (e) {
      ctx.status = 500
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
      if (getDataList) {
        entries = filter(getDataList, key)
        if (getDataList[key]) {
          ctx.status = 200
          ctx.body = 'Record deleted'
        } else {
          ctx.status = 404
          ctx.body = 'Record not found'
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, entries)
      } else {
        ctx.status = 404
        ctx.body = 'No data saved'
      }
    } catch (e) {
      ctx.status = 500
      ctx.body = `error: ${e}`
    }
  } else {
    ctx.status = 400
    ctx.body = 'Required data is missing'
  }
}
