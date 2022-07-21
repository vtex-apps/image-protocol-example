/* eslint-disable no-console */
import type { ReadStream } from 'fs'

import { LogLevel } from '@vtex/api'

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
    vtex: { logger },
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

  if (customerClass.length > 0 && polygon.length > 0) {
    try {
      key = `${customerClass}-${polygon}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON, true)
      logger.log(
        {
          message: `saveInfo middleware. If customerClass and polygon exist. Inside try block. Get saved data in vbase`,
          detail: {
            getCustomerList,
          },
        },
        LogLevel.Info
      )
      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, customerUrls)
        logger.log(
          {
            message: `saveInfo middleware. If customerClass and polygon exist and there is no data saved in vbase yet`,
            detail: {
              customerUrls,
            },
          },
          LogLevel.Info
        )

        ctx.status = 201
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CCPOLYGON, getCustomerList)

        logger.log(
          {
            message: `saveInfo middleware. If customerClass and polygon exist and there is data saved in vbase. Update record ${getCustomerList[key]}`,
            detail: {
              url,
              urlMobile,
              hrefImg,
            },
          },
          LogLevel.Info
        )
        await vbase.getJSON(BUCKET, CONFIG_PATH_CCPOLYGON)

        ctx.status = 201
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
      const response = { url: null, urlMobile: null, hrefImg: null }

      logger.log(
        {
          message: `saveInfo middleware. Catch block`,
          detail: {
            e,
          },
        },
        LogLevel.Error
      )
      ctx.status = 404
      ctx.body = response
    }
  } else if (customerClass.length > 0 && (!polygon || polygon.length === 0)) {
    try {
      key = `${customerClass}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_CC, true)
      logger.log(
        {
          message: `saveInfo middleware. Inside try block. If only customerClass exist. Get saved data in vbase`,
          detail: {
            getCustomerList,
          },
        },
        LogLevel.Info
      )
      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, customerUrls)

        logger.log(
          {
            message: `saveInfo middleware. If only customerClass exist and there is no data saved in vbase yet`,
            detail: {
              customerUrls,
            },
          },
          LogLevel.Info
        )
        ctx.status = 201
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_CC, getCustomerList)
        logger.log(
          {
            message: `saveInfo middleware. If only customerClass exist and there is data saved in vbase. Update record ${getCustomerList[key]}`,
            detail: {
              url,
              urlMobile,
              hrefImg,
            },
          },
          LogLevel.Info
        )
        ctx.status = 201
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
      const response = { url: null, urlMobile: null, hrefImg: null }

      logger.log(
        {
          message: `saveInfo middleware. Inside the catch block`,
          detail: {
            e,
          },
        },
        LogLevel.Error
      )
      ctx.status = 404
      ctx.body = response
    }
  } else if (
    (!customerClass || customerClass.length === 0) &&
    polygon.trim().length > 1
  ) {
    try {
      key = `${polygon}-${imgId}`
      getCustomerList = await vbase.getJSON(BUCKET, CONFIG_PATH_POLYGON, true)
      logger.log(
        {
          message: `saveInfo middleware. If only polygon exists. Get saved data in vbase`,
          detail: {
            getCustomerList,
          },
        },
        LogLevel.Info
      )
      if (!getCustomerList) {
        const customerUrls = {
          [key]: { url, urlMobile, hrefImg },
        }

        await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, customerUrls)
        logger.log(
          {
            message: `saveInfo middleware. If only polygon exists. No data saved in vbase yet.`,
            detail: {
              getCustomerList,
            },
          },
          LogLevel.Info
        )
        ctx.status = 201
        ctx.body = customerUrls
      } else {
        getCustomerList[key] = { url, urlMobile, hrefImg }
        await vbase.saveJSON(BUCKET, CONFIG_PATH_POLYGON, getCustomerList)
        logger.log(
          {
            message: `saveInfo middleware. If only polygon exists. Data saved in vbase. Update record ${getCustomerList[key]}`,
            detail: {
              url,
              urlMobile,
              hrefImg,
            },
          },
          LogLevel.Info
        )
        ctx.status = 201
        ctx.body = getCustomerList[key]
      }
    } catch (e) {
      const response = { url: null, urlMobile: null, hrefImg: null }

      logger.log(
        {
          message: `saveInfo middleware. If only polygon exists. Inside catch block.`,
          detail: {
            e,
          },
        },
        LogLevel.Error
      )
      ctx.status = 404
      ctx.body = response
    }
  } else {
    ctx.status = 400
    ctx.body = 'customerClass or polygon are empty'
  }
}
