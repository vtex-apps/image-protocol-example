interface RequestData {
  userId: string
  imageProtocolId: string
  latitude: string
  longitude: string
}

interface CustomerData {
  customerClass?: string | undefined
  polygons?: string[] | undefined
}
