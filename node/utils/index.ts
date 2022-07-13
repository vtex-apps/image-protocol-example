export const parseQueryString = (queryString: string) => {
  const queries = queryString.split('&')
  const parsedQueryString: { [key: string]: string } = {}

  for (const item of queries) {
    const keyValue = item.split('=')

    parsedQueryString[keyValue[0]] = keyValue[1]
  }

  return parsedQueryString
}

export const protocolKeyGenerator = (
  protocolId: string,
  customerData: CustomerData = {
    customerClass: undefined,
    polygonId: undefined,
  }
) => {
  const { customerClass, polygonId } = customerData

  if (customerClass && polygonId) {
    return `${customerClass}-${polygonId}-${protocolId}`
  }

  if (customerClass) return `${customerClass}-${protocolId}`

  return `${polygonId}-${protocolId}`
}
