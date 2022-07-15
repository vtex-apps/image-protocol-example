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

  const { customerClass, polygon, imgId, url, urlMobile, hrefImg } = await json(
    ctx.req
  )

  console.log(customerClass, polygon, imgId, url, urlMobile, hrefImg)

  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gm
  const regExp = new RegExp(expression)

  /* const expr = /[^A-Za-z0-9]*$/g
  const regExp2 = new RegExp(expr) */

  if (!regExp.test(hrefImg)) {
    ctx.status = 400
    ctx.body = 'wrong format for hrefImg'

    return
  }

  /* console.log('** test customerClass', regExp2.test(customerClass))
  console.log('** test polygon', regExp2.test(polygon))
  if (!regExp2.test(customerClass) || !regExp2.test(polygon)) {
    console.log('test customerClass', regExp2.test(customerClass))
    console.log('test polygon', regExp2.test(polygon))
    ctx.status = 400
    ctx.body =
      'Wrong format for customerClass and/or polygon. Only letters and numbers are allowed'

    return
  } */

  let key = ''
  let getCustomerList: Record<string, unknown> | null = null

  if (
    (imgId.length === 0 &&
      url.length === 0 &&
      urlMobile.length === 0 &&
      hrefImg.length === 0) ||
    imgId.length === 0 ||
    url.length === 0 ||
    urlMobile.length === 0 ||
    hrefImg.length === 0
  ) {
    ctx.status = 400
    ctx.body = 'required data missing'

    return
  }

  if (customerClass.trim().length > 1 && polygon.trim().length > 1) {
    console.log(
      'customerClass',
      customerClass,
      ' ',
      customerClass.length,
      ' polygon',
      polygon,
      ' ',
      polygon.length
    )
    try {
      key = `${customerClass}-${polygon}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)

      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, customerUrls)

        console.info('data saved: ', customerUrls)

        ctx.status = 200
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, getCustomerList)

        await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON)

        ctx.status = 200
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
      console.log('error: ', e)
      const response = { url: null, urlMobile: null, hrefImg: null }

      ctx.status = 404
      ctx.body = response
    }
  } else if (
    customerClass.trim().length > 1 &&
    (!polygon || polygon.trim().length === 0)
  ) {
    try {
      key = `${customerClass}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)

      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, customerUrls)

        ctx.status = 200
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, getCustomerList)

        ctx.status = 404
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
      console.log('error: ', e)
      const response = { url: null, urlMobile: null, hrefImg: null }

      ctx.status = 404
      ctx.body = response
    }
  } else if (
    (!customerClass || customerClass.trim().length === 0) &&
    polygon.trim().length > 1
  ) {
    try {
      key = `${polygon}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)

      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, customerUrls)

        ctx.status = 200
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, getCustomerList)

        ctx.status = 404
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
      console.log('error: ', e)
      const response = { url: null, urlMobile: null, hrefImg: null }

      ctx.status = 404
      ctx.body = response
    }
  } else {
    ctx.status = 400
    ctx.body = 'customerClass or polygon are empty'
  }
}
