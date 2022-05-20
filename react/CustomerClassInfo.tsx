/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useState } from 'react'
import { Layout, Dropzone, Input, Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import POST_CustomerClassInfo from './graphql/customerClassInfo.graphql'
import UPLOAD_mutation from './graphql/uploadFile.graphql'

interface IncomingFile {
  uploadFile: { fileUrl: string }
}

const CustomerClassInfo: FC = () => {
  const [customerClassValue, setCustomerClassValue] = useState<string>('')
  const [url, setURL] = useState<string>('')
  const [urlMobile, setURLMobile] = useState<string>('')
  const [idImg, setIdImg] = useState<string>('')
  const [uploadFile] = useMutation<IncomingFile>(UPLOAD_mutation)
  const [postCustomerClassInfo, { data2, loading2, error2 }] = useMutation(
    POST_CustomerClassInfo
  )

  const handleImageDesktop = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      try {
        const resp = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        const { fileUrl } = resp.data.uploadFile

        setURL(fileUrl)
      } catch (e) {
        console.log('error message', e)
      }
    } else {
      console.log('no accepted files')
    }
  }

  const handleImageMobile = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      try {
        const resp = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        const { fileUrl } = resp.data.uploadFile

        setURLMobile(fileUrl)
        console.log('response uploadFile url:', url)
      } catch (e) {
        console.log('error message', e)
      }
    } else {
      console.log('no accepted files')
    }
  }

  function handleSubmit(e: any) {
    e.preventDefault()
    console.log('customerClassValue: ', customerClassValue)
    console.log('idImg: ', idImg)
    postCustomerClassInfo({
      variables: { customerClassValue, url, urlMobile, idImg },
    })
    if (loading2) {
      console.log('loading')
    }

    if (error2) {
      console.log('error: ', error2)
    }

    return data2
  }

  return (
    <Layout>
      <h1>Image Protocol</h1>
      <form
        onSubmit={(e: any) => {
          handleSubmit(e)
        }}
      >
        <div className="w-20">
          <Input
            placeholder="Customer Class"
            size="Regular"
            label="Customer Class"
            required
            value={customerClassValue}
            onChange={(e: any) => setCustomerClassValue(e.target.value)}
          />
        </div>
        <div className="w-40 mt4 mb4">
          <span>Select an image for desktop</span>
          <Dropzone onDropAccepted={handleImageDesktop}>
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
          <span>Select an image for mobile</span>
          <Dropzone onDropAccepted={handleImageMobile}>
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
        <div className="w-20 ">
          <Input
            placeholder="ID"
            size="Regular"
            label="Image Protocol ID"
            required
            value={idImg}
            onChange={(e: any) => setIdImg(e.target.value)}
          />
        </div>
        <div className="mt4" style={{ alignSelf: 'end' }}>
          <Button variation="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Layout>
  )
}

export default CustomerClassInfo
