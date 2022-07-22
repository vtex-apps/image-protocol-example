interface PolygonsResponse {
  items: string[]
  paging: Paging
}

interface Paging {
  page: number
  perPage: number
  total: number
  pages: number
}

interface PolygonDetail {
  isActive: boolean
  name: string
  geoShape: GeoShape
}

interface GeoShape {
  coordinates: number[][][]
  type: string
}

interface PolygonsData {
  polygonId: string
  coordinates: number[][][]
}
