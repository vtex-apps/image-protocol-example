import {
  POLYGON_PRIORITY_SETTING,
  CUSTOMER_CLASS_PRIORITY_SETTING,
} from '../constants'

export const parseQueryString = (queryString: string) => {
  const queries = queryString.split('&')
  const parsedQueryString: { [key: string]: string } = {}

  for (const item of queries) {
    const keyValue = item.split('=')

    parsedQueryString[keyValue[0]] = keyValue[1]
  }

  return parsedQueryString
}

export const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

export const getAppPrioritySettings = (appSettings: any): string[] => {
  if (
    Object.prototype.hasOwnProperty.call(
      appSettings,
      POLYGON_PRIORITY_SETTING
    ) ||
    Object.prototype.hasOwnProperty.call(
      appSettings,
      CUSTOMER_CLASS_PRIORITY_SETTING
    )
  ) {
    return Object.keys(appSettings).sort((a, b) => {
      return appSettings[a] - appSettings[b]
    })
  }

  return [CUSTOMER_CLASS_PRIORITY_SETTING, POLYGON_PRIORITY_SETTING]
}
