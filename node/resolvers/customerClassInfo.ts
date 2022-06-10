import { BUCKET, CONFIG_PATH } from '../constants/index'

interface CustomerClassInfo {
  customerClassValue: string
  url: string
  urlMobile: string
  idImg: string
}

export const customerClassInfo = async (
  _: unknown,
  args: CustomerClassInfo,
  ctx: Context
) => {
  const {
    clients: { vbase },
  } = ctx

  const { customerClassValue, url, urlMobile, idImg } = args
  const key = `${customerClassValue}-${idImg}`

  try {
    const resGetJson: Record<string, unknown> = await vbase.getJSON(
      BUCKET,
      CONFIG_PATH
    )

    resGetJson[key] = { url, urlMobile }
    const resSaveJson = await vbase.saveJSON(BUCKET, CONFIG_PATH, resGetJson)
    // eslint-disable-next-line no-console

    console.info('savedJSON res: ', resSaveJson)

    const resGetJsonAfter = await vbase.getJSON(BUCKET, CONFIG_PATH)

    // eslint-disable-next-line no-console

    console.info('getJSON res: ', resGetJsonAfter)

    return args
  } catch (e) {
    return e
  }
}
