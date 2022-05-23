/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useState } from 'react'
import { Layout, Input, Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import UploadImage from './UploadImage'
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
  const [postCustomerClassInfo, { data, loading, error }] = useMutation(
    POST_CustomerClassInfo
  )

  const handleUrlReset = () => {
    setURL('')
    console.log('url desktop: ', url)
  }

  const handleUrlMobileReset = () => {
    setURLMobile('')
    console.log('url mobile: ', urlMobile)
  }

  const handleImageDesktop = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      console.log('desktop file added: ', acceptedFiles[0])
      try {
        const resp = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        const { fileUrl } = resp.data.uploadFile

        console.log('Desktop fileUrl: ', fileUrl)
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
      console.log('mobile file added: ', acceptedFiles[0])
      try {
        const resp = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        const { fileUrl } = resp.data.uploadFile

        console.log('Mobile fileUrl: ', fileUrl)
        setURLMobile(fileUrl)
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

    if (!url || !urlMobile) {
      // eslint-disable-next-line no-alert
      alert('image(s) missing')

      return
    }

    postCustomerClassInfo({
      variables: { customerClassValue, url, urlMobile, idImg },
    })

    if (loading) {
      console.log('loading')
    }

    if (error) {
      console.log('error: ', error)
    }

    setCustomerClassValue('')
    setIdImg('')
    handleUrlReset()
    handleUrlMobileReset()

    return data
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
        <UploadImage
          handleImageDesktop={handleImageDesktop}
          handleUrlReset={handleUrlReset}
          handleImageMobile={handleImageMobile}
          handleUrlMobileReset={handleUrlMobileReset}
        />
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
