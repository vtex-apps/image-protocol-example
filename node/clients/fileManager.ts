import type { IOContext, InstanceOptions } from '@vtex/api'
import { AppClient } from '@vtex/api'
import { v4 as uuidv4 } from 'uuid'

import type { MultipartFile } from '../middlewares/saveInfo'

const appId = process.env.VTEX_APP_ID
const [runningAppName] = appId ? appId.split('@') : ['']

const routes = {
  Assets: () => `/assets/${runningAppName}`,
  FileUpload: (bucket: string, path: string) =>
    `${routes.Assets()}/save/${bucket}/${path}`,
}

export default class FileManager extends AppClient {
  public static readonly bucket = 'imgs'
  constructor(ioContext: IOContext, opts: InstanceOptions = {}) {
    super('vtex.file-manager@0.x', ioContext, opts)
  }

  public saveFile = async (file: MultipartFile): Promise<string> => {
    try {
      const { filename, encoding, mimeType } = file
      const uuid = uuidv4()

      const extension = filename?.split('.')?.pop() ?? 'jpg'
      const path = `${uuid}.${extension}`

      return await this.http.put(
        routes.FileUpload(FileManager.bucket, path),
        file,
        {
          headers: {
            'Content-Type': mimeType,
            'Content-Encoding': encoding,
          },
        }
      )
    } catch (e) {
      console.info(e)

      return e
    }
  }
}
