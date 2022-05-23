/* eslint-disable no-console */
import type { FC } from 'react'
import React from 'react'
import { Dropzone } from 'vtex.styleguide'
// import { useMutation } from 'react-apollo'

// import UPLOAD_mutation from './graphql/uploadFile.graphql'

/* interface IncomingFile {
  uploadFile: { fileUrl: string }
} */

type Props = {
  handleImageDesktop: (...args: any[]) => any
  handleImageMobile: (...args: any[]) => any
  handleUrlReset: () => void
  handleUrlMobileReset: () => void
}
const UploadImage: FC<Props> = (props: Props) => {
  const handleImgDesktop = (acceptedFiles: File[]) => {
    props.handleImageDesktop(acceptedFiles)
  }

  const handleUrlReset = () => {
    props.handleUrlReset()
  }

  const handleImgMobile = (acceptedFiles: File[]) => {
    props.handleImageMobile(acceptedFiles)
  }

  const handleUrlMobileReset = () => {
    props.handleUrlMobileReset()
  }

  return (
    <div>
      <div className="w-40 mt4 mb4">
        <Dropzone
          accept="image/*"
          onDropAccepted={handleImgDesktop}
          onFileReset={handleUrlReset}
        >
          <div className="pt7">
            <div>
              <span className="f4">Drop here your image or </span>
              <span className="f4 c-link" style={{ cursor: 'pointer' }}>
                choose a file
              </span>
            </div>
          </div>
        </Dropzone>
      </div>
      <div className="w-40 mt4 mb4">
        <Dropzone
          accept="image/*"
          onDropAccepted={handleImgMobile}
          onFileReset={handleUrlMobileReset}
        >
          <div className="pt7">
            <div>
              <span className="f4">Drop here your image or </span>
              <span className="f4 c-link" style={{ cursor: 'pointer' }}>
                choose a file
              </span>
            </div>
          </div>
        </Dropzone>
      </div>
    </div>
  )
}

export default UploadImage
