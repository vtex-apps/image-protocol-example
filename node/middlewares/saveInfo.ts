/* eslint-disable no-console */
import { json } from 'co-body'

import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../constants/index'

export async function saveInfo(ctx: Context) {
  const {
    clients: { vbase },
  } = ctx

  console.log('req: ', ctx.req)
  const { customerClass, polygon, imgId, url, urlMobile, hrefImg } = await json(
    ctx.req
  )

  let key = ''
  let getCustomerList: Record<string, unknown> | null = null

  if (customerClass && polygon) {
    try {
      key = `${customerClass}-${polygon}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)

      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        const response = await vbase.saveJSON(
          BUCKET,
          CONFIG_PATH_CCPOLYGON,
          customerUrls
        )

        console.info('response: ', response)

        ctx.status = 200
        ctx.body = response
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, getCustomerList)

        const resGetJsonAfter = await vbase.getJSON(
          BUCKET,
          CONFIG_PATH_CCPOLYGON
        )

        ctx.status = 200
        ctx.body = resGetJsonAfter
      }
    } catch (e) {
      console.log('error: ', e)
      const response = { url: null, urlMobile: null, hrefImg: null }

      ctx.status = 404
      ctx.body = response
    }
  } else if (customerClass && !polygon) {
    try {
      key = `${customerClass}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)

      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        const response = await vbase.saveJSON(
          BUCKET,
          CONFIG_PATH_CC,
          customerUrls
        )

        ctx.status = 200
        ctx.body = response
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, getCustomerList)

        const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH_CC)

        ctx.status = 404
        ctx.body = resGetJsonAfter
      }
    } catch (e) {
      console.log('error: ', e)
      const response = { url: null, urlMobile: null, hrefImg: null }

      ctx.status = 404
      ctx.body = response
    }
  } else if (!customerClass && polygon) {
    try {
      key = `${polygon}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)

      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        const response = await vbase.saveJSON(
          BUCKET,
          CONFIG_PATH_POLYGON,
          customerUrls
        )

        ctx.status = 200
        ctx.body = response
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, getCustomerList)

        const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON)

        ctx.status = 404
        ctx.body = resGetJsonAfter
      }
    } catch (e) {
      console.log('error: ', e)
      const response = { url: null, urlMobile: null, hrefImg: null }

      ctx.status = 404
      ctx.body = response
    }
  }
}
