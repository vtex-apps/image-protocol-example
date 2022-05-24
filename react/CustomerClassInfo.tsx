/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useState } from 'react'
import { Layout, Input, Button, Spinner } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'
import Dropzone from 'react-dropzone'

import EmptyState from './EmptyState'
import UPLOAD_mutation from './graphql/uploadFile.graphql'
import POST_CustomerClassInfo from './graphql/customerClassInfo.graphql'

interface IncomingFile {
  uploadFile: { fileUrl: string }
}

const CustomerClassInfo: FC = () => {
  const [err, setError] = useState('')
  const [isLoadingDesktopImg, setLoadingDesktopImg] = useState(Boolean)
  const [isLoadingMobileImg, setLoadingMobileImg] = useState(Boolean)
  const [customerClassValue, setCustomerClassValue] = useState('')
  const [idImg, setIdImg] = useState('')
  const [desktopFileName, setDesktopFileName] = useState('')
  const [mobileFileName, setMobileFileName] = useState('')
  const [url, setUrl] = useState('')
  const [urlMobile, setUrlMobile] = useState('')

  const [postCustomerClassInfo, { data, loading, error }] = useMutation(
    POST_CustomerClassInfo
  )

  const [uploadFile] = useMutation<IncomingFile>(UPLOAD_mutation)

  function handleCustomerClassValue(e: any) {
    setCustomerClassValue(e.target.value)
  }

  function handleIdImgValue(e: any) {
    setIdImg(e.target.value)
  }

  const removeDesktopFile = () => {
    setDesktopFileName('')
    setUrl('')
  }

  const removeMobileFile = () => {
    setMobileFileName('')
    setUrlMobile('')
  }

  const handleDesktopFile = async (acceptedFiles: File[]) => {
    setLoadingDesktopImg(true)
    if (acceptedFiles?.[0]) {
      console.log('desktop file added: ', acceptedFiles[0])
      try {
        const resp = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        console.log('upload file', resp.data.uploadFile)
        const { fileUrl } = resp.data.uploadFile

        console.log('Desktop fileUrl: ', fileUrl)
        setDesktopFileName(acceptedFiles[0].name)
        setUrl(fileUrl)
        setLoadingDesktopImg(false)
      } catch (e) {
        console.log('error message', e)
        setError('Something went wrong')
      }
    } else {
      console.log('no accepted files')
    }
  }

  const handleMobileFile = async (acceptedFiles: File[]) => {
    setLoadingMobileImg(true)
    if (acceptedFiles?.[0]) {
      console.log('mobile file added: ', acceptedFiles[0])
      try {
        const resp = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        const { fileUrl } = resp.data.uploadFile

        console.log('Mobile fileUrl: ', fileUrl)
        setMobileFileName(acceptedFiles[0].name)
        setUrlMobile(fileUrl)
        setLoadingMobileImg(false)
      } catch (e) {
        console.log('error message', e)
        setError('Something went wrong')
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
      console.log('error message', e)
      setError('Something went wrong')
    }

    setCustomerClassValue('')
    setDesktopFileName('')
    setMobileFileName('')
    setUrl('')
    setUrlMobile('')
    setIdImg('')

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
            onChange={(e: any) => {
              handleCustomerClassValue(e)
            }}
          />
        </div>
        <Dropzone onDrop={(acceptedFiles) => handleDesktopFile(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div
                {...getRootProps()}
                className={` ${
                  isLoadingDesktopImg &&
                  'ba b--dashed bw1 b--light-gray bg-white b--solid'
                }`}
              >
                <input {...getInputProps()} />
                {isLoadingDesktopImg ? (
                  <div className="w-100 h-100 flex justify-center items-center">
                    <Spinner />
                  </div>
                ) : (
                  <EmptyState fileName={desktopFileName} />
                )}
                {url !== '' && (
                  <button onClick={removeDesktopFile}>Remove</button>
                )}
              </div>
            </section>
          )}
        </Dropzone>
        <Dropzone onDrop={(acceptedFiles) => handleMobileFile(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div
                {...getRootProps()}
                className={` ${
                  isLoadingMobileImg &&
                  'ba b--dashed bw1 b--light-gray bg-white b--solid'
                }`}
              >
                <input {...getInputProps()} />
                {isLoadingMobileImg ? (
                  <div className="w-100 h-100 flex justify-center items-center">
                    <Spinner />
                  </div>
                ) : (
                  <EmptyState fileName={mobileFileName} />
                )}
                {urlMobile !== '' && (
                  <button onClick={removeMobileFile}>Remove</button>
                )}
              </div>
            </section>
          )}
        </Dropzone>
        <div className="w-20 ">
          <Input
            placeholder="ID"
            size="Regular"
            label="Image Protocol ID"
            required
            value={idImg}
            onChange={(e: any) => {
              handleIdImgValue(e)
            }}
          />
        </div>
        <div className="mt4" style={{ alignSelf: 'end' }}>
          <Button variation="primary" type="submit">
            Submit
          </Button>
        </div>
        {err !== '' && err !== null && (
          <p className="bg-red">Something went wrong {err}</p>
        )}
      </form>
    </Layout>
  )
}

export default CustomerClassInfo
