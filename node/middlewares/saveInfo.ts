/* eslint-disable no-console */

import type { ReadStream } from 'fs'

import {
  BUCKET,
  CONFIG_PATH_CCPOLYGON,
  CONFIG_PATH_CC,
  CONFIG_PATH_POLYGON,
} from '../constants/index'

export interface MultipartFile extends ReadStream {
  fieldname: string
  filename: string
  path: string
  encoding: string
  mimeType: string
}

type ImagesLinks = Array<{
  fileLink: string
  fileName: string
  fieldName: string
}>

interface ObjLinks {
  [key: string]: string
}

export async function saveInfo(ctx: Context) {
  const {
    clients: { fileManager, vbase },
  } = ctx

  const { fields, files } = ctx.state.request
  let key = ''
  let getCustomerList: Record<string, unknown> | null = null

  const imagesLinks: ImagesLinks = []

  const objLinks: ObjLinks = {}

  const fieldNames: string[] = ['url', 'urlMobile']
  const { customerClass, polygon, imgId, hrefImg } = fields

  if (files) {
    for (const f of files) {
      const file = f as MultipartFile
      const fileName = file.filename
      const fieldName = file.fieldname

      if (fieldNames.includes(fieldName)) {
        imagesLinks.push({
          // eslint-disable-next-line no-await-in-loop
          fileLink: await fileManager.saveFile(file),
          fileName,
          fieldName,
        })
      }
    }

    imagesLinks.forEach((image) => {
      objLinks[image.fieldName] = image.fileLink
    })
  }

  const { url, urlMobile } = objLinks

  if (customerClass.trim().length > 0 && polygon.trim().length > 0) {
    try {
      key = `${customerClass}-${polygon}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)

      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, customerUrls)

        ctx.status = 201
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, getCustomerList)

        await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON)

        ctx.status = 201
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
      const response = { url: null, urlMobile: null, hrefImg: null }

      ctx.status = 404
      ctx.body = response
    }
  } else if (
    customerClass.trim().length > 0 &&
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

        ctx.status = 201
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, getCustomerList)

        ctx.status = 201
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
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

        ctx.status = 201
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, getCustomerList)

        ctx.status = 201
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
      const response = { url: null, urlMobile: null, hrefImg: null }

      ctx.status = 404
      ctx.body = response
    }
  } else {
    ctx.status = 400
    ctx.body = 'customerClass or polygon are empty'
  }
}
