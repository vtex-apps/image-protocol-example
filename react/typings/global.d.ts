interface TableItem {
  cellData: unknown
  rowData: DataInfo
  updateCellMeasurements: () => void
}

interface DataInfo {
  customerClass: string
  polygon: string
  imageProtocolId: string
  desktopUrl: string
  mobileUrl: string
  hrefImg: string
}

interface IncomingFile {
  uploadFile: { fileUrl: string }
}
interface Option {
  value: string
  label: string
}
