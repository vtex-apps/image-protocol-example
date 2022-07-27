import fs from 'fs'

import asyncBusboy from 'async-busboy'

import type { MultipartFile } from './saveInfo'

export async function validations(ctx: Context, next: () => Promise<unknown>) {
  const {
    clients: { logistics },
    req,
  } = ctx

  const { fields, files } = await asyncBusboy(req)
  const { customerClass, polygon, imgId, hrefImg } = fields
  const response = await logistics.getListOfPolygons()
  const polygons = response.items

  if (
    (imgId.length === 0 && hrefImg.length === 0) ||
    imgId.length === 0 ||
    hrefImg.length === 0 ||
    (customerClass.trim().length === 0 && polygon.trim().length === 0)
  ) {
    ctx.status = 400
    ctx.body = 'Required data missing'

    return
  }

  if (polygon.trim().length !== 0 && !polygons.includes(polygon)) {
    ctx.status = 400
    ctx.body = `This polygon ${polygon} does not exist`

    return
  }

  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gm
  const regExp = new RegExp(expression)

  const expr = /^[A-Za-z0-9]*$/
  const regExp2 = new RegExp(expr)

  if (!regExp.test(fields.hrefImg)) {
    ctx.status = 400
    ctx.body = 'Wrong format for hrefImg. Format example: https://www.google.es'

    return
  }

  if (!regExp2.test(fields.customerClass) || !regExp2.test(fields.polygon)) {
    ctx.status = 400
    ctx.body =
      'Wrong format for customerClass and/or polygon. Only letters and numbers are allowed'

    return
  }

  if (files) {
    for (const file of files) {
      const f = file as MultipartFile
      const stat = fs.statSync(f.path)

      if (stat.size === 0 && !f.filename) {
        ctx.status = 400
        ctx.body = 'Required file(s) is missing'

        return
      }

      if (
        f.mimeType !== 'image/jpg' &&
        f.mimeType !== 'image/jpeg' &&
        f.mimeType !== 'image/jpeg'
      ) {
        ctx.status = 400
        ctx.body = 'Format of file(s) is not correct'

        return
      }
    }
  }

  ctx.state.request = { fields, files }
  await next()
}
