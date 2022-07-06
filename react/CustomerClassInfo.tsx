/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import {
  Layout,
  PageBlock,
  Input,
  Alert,
  Button,
  Spinner,
  IconDelete,
  Dropdown,
} from 'vtex.styleguide'
import { useMutation, useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import Dropzone from 'react-dropzone'

import EmptyState from './EmptyState'
import UPLOAD_mutation from './graphql/uploadFile.graphql'
import POST_CustomerClassInfo from './graphql/customerClassInfo.graphql'
import GET_Polygons from './graphql/getPolygons.graphql'

interface IncomingFile {
  uploadFile: { fileUrl: string }
}

const CustomerClassInfo: FC = () => {
  const { query } = useRuntime()
  const { data, loading, error } = useQuery(GET_Polygons)

  const [err, setError] = useState('')
  const [isLoadingDesktopImg, setLoadingDesktopImg] = useState(Boolean)
  const [isLoadingMobileImg, setLoadingMobileImg] = useState(Boolean)
  const [customerClassValue, setCustomerClassValue] = useState('')
  const [polygon, setPolygon] = useState('')
  const [hrefImg, setHrefImage] = useState('')
  const [idImg, setIdImg] = useState('')
  const [desktopFileName, setDesktopFileName] = useState('')
  const [mobileFileName, setMobileFileName] = useState('')

  const [url, setUrl] = useState('')
  const [urlMobile, setUrlMobile] = useState('')
  const [success, setSuccess] = useState(Boolean)

  useEffect(() => {
    console.info(query)
    const isEmpty = Object.keys(query).length === 0

    if (isEmpty) {
      return
    }

    setCustomerClassValue(query.customerClass)
    setUrl(query.desktopUrl)
    setUrlMobile(query.mobileUrl)
    setIdImg(query.imageProtocolId)
  }, [query])

  let polygons: any[] = []
  const options: any[] = []

  useEffect(() => {
    console.log('loading:', loading)
    console.log('error:', error)
    console.log('polygons: ', data)
  }, [data, loading, error])

  if (data) {
    polygons = data.getPolygons.polygons
    for (let i = 0; i < polygons.length; i++) {
      options.push({ value: polygons[i], label: polygons[i] })
    }
  }

  const [
    postCustomerClassInfo,
    { data: data2, loading: loading2, error: error2 },
  ] = useMutation(POST_CustomerClassInfo)

  const [uploadFile] = useMutation<IncomingFile>(UPLOAD_mutation)

  function handleCustomerClassValue(e: any) {
    setCustomerClassValue(e.target.value)
  }

  function handlePolygon(e: any) {
    setPolygon(e.target.value)
  }

  function handleHref(e: any) {
    setHrefImage(e.target.value)
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
    console.log(
      'customerClassValue: ',
      customerClassValue,
      '; idImg: ',
      idImg,
      '; polygon: ',
      polygon,
      '; href: ',
      hrefImg
    )

    if (!url || !urlMobile) {
      // eslint-disable-next-line no-alert
      alert('url(s) missing')

      return
    }

    if (!customerClassValue && !polygon) {
      // eslint-disable-next-line no-alert
      alert('customer class or polygon missing')

      return
    }

    postCustomerClassInfo({
      variables: {
        customerClassValue,
        polygon,
        url,
        urlMobile,
        hrefImg,
        idImg,
      },
    })

    if (loading2) {
      console.log('loading')
    }

    if (error2) {
      console.log('error: ', error)
      setError('Something went wrong')
    }

    setCustomerClassValue('')
    setPolygon('')
    setDesktopFileName('')
    setMobileFileName('')
    setUrl('')
    setUrlMobile('')
    setHrefImage('')
    setIdImg('')
    setSuccess(true)

    return data2
  }

  const intl = useIntl()

  return (
    <Layout fullWidth>
      {success && (
        <div className="mv5">
          <Alert
            autoClose={3000}
            onClose={() => setSuccess(false)}
            type="success"
          >
            Submitted
          </Alert>
        </div>
      )}
      <div className="bg-muted-5 pa8">
        <PageBlock
          title={<FormattedMessage id="admin/image-protocol.title.label" />}
        >
          <form
            onSubmit={(e: any) => {
              handleSubmit(e)
            }}
          >
            <div className="mb4 w-90 w-40-m">
              <Input
                placeholder={intl.formatMessage({
                  id: 'admin/image-protocol.form.customer-class.label',
                })}
                size="Regular"
                label={intl.formatMessage({
                  id: 'admin/image-protocol.form.customer-class.label',
                })}
                value={customerClassValue}
                onChange={(e: any) => {
                  handleCustomerClassValue(e)
                }}
              />
            </div>
            <div className="mb4 w-90 w-40-m">
              <Dropdown
                label={intl.formatMessage({
                  id: 'admin/image-protocol.form.polygon.label',
                })}
                options={options}
                value={polygon}
                onChange={(e: any) => {
                  handlePolygon(e)
                }}
              />
              {/* <Button
                onClick={() => {
                  navigate({
                    to: '/admin/app/logistics/#/geolocation',
                  })
                }}
              >
                <FormattedMessage id="admin/image-protocol.form.create-new-polygon.label" />
              </Button> */}
            </div>
            <div className="mt4 mb4">
              <p className="t-small mb3 c-on-base">
                <FormattedMessage id="admin/image-protocol.form.desktop-image.label" />
              </p>
              <Dropzone
                onDrop={(acceptedFiles) => handleDesktopFile(acceptedFiles)}
                accept="image/*"
              >
                {({ getRootProps, getInputProps }) => (
                  <section className="w-90 w-40-m">
                    <div
                      {...getRootProps()}
                      className={` ${isLoadingDesktopImg && 'b--mid-gray'}`}
                    >
                      <input {...getInputProps()} />
                      {isLoadingDesktopImg ? (
                        <div className="flex justify-center items-center">
                          <Spinner />
                        </div>
                      ) : (
                        <EmptyState fileName={desktopFileName} />
                      )}
                    </div>
                  </section>
                )}
              </Dropzone>
              {url !== '' && (
                <div className="w-90 w-40-m mt2 flex flex-column">
                  <img src={url} alt={desktopFileName} />
                  <Button variation="danger" onClick={removeDesktopFile}>
                    <IconDelete />
                  </Button>
                </div>
              )}
            </div>
            <div className="mb4">
              <p className="t-small mb3 c-on-base">
                <FormattedMessage id="admin/image-protocol.form.mobile-image.label" />
              </p>
              <Dropzone
                onDrop={(acceptedFiles) => handleMobileFile(acceptedFiles)}
                accept="image/*"
              >
                {({ getRootProps, getInputProps }) => (
                  <section className="w-90 w-40-m">
                    <div
                      {...getRootProps()}
                      className={` ${isLoadingMobileImg && 'b--mid-gray'}`}
                    >
                      <input {...getInputProps()} />
                      {isLoadingMobileImg ? (
                        <div className="flex justify-center items-center">
                          <Spinner />
                        </div>
                      ) : (
                        <EmptyState fileName={mobileFileName} />
                      )}
                    </div>
                  </section>
                )}
              </Dropzone>
              {urlMobile !== '' && (
                <div className="w-90 w-40-m mt2 flex flex-column">
                  <img src={urlMobile} alt={mobileFileName} />
                  <Button variation="danger" onClick={removeMobileFile}>
                    <IconDelete />
                  </Button>
                </div>
              )}
            </div>
            <div className="mb4 w-90 w-40-m">
              <Input
                placeholder={intl.formatMessage({
                  id: 'admin/image-protocol.form.href.label',
                })}
                size="Regular"
                label={intl.formatMessage({
                  id: 'admin/image-protocol.form.href.label',
                })}
                required
                value={hrefImg}
                onChange={(e: any) => {
                  handleHref(e)
                }}
              />
            </div>
            <div className="w-90 w-40-m">
              <Input
                placeholder="ID"
                size="Regular"
                label={intl.formatMessage({
                  id: 'admin/image-protocol.form.image-protocol-id.label',
                })}
                required
                value={idImg}
                onChange={(e: any) => {
                  handleIdImgValue(e)
                }}
              />
            </div>
            <div className="mt4" style={{ alignSelf: 'end' }}>
              <Button type="submit">
                <FormattedMessage id="admin/image-protocol.form.submit.label" />
              </Button>
            </div>
            {err !== '' && err !== null && (
              <p className="bg-red">Something went wrong </p>
            )}
          </form>
        </PageBlock>
      </div>
    </Layout>
  )
}

export default CustomerClassInfo
