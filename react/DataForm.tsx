/* eslint-disable no-console */
import type { FC, ChangeEvent } from 'react'
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

import styles from './styles.css'
import EmptyState from './EmptyState'
import UPLOAD_mutation from './graphql/uploadFile.graphql'
import POST_DataInfo from './graphql/saveDataInfo.graphql'
import GET_Polygons from './graphql/getPolygons.graphql'

const CustomerClassInfo: FC = () => {
  const { query, navigate } = useRuntime()
  const { data } = useQuery(GET_Polygons)

  const [err, setError] = useState(false)
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
    const isEmpty = Object.keys(query).length === 0

    if (isEmpty) {
      return
    }

    setCustomerClassValue(query.customerClass)
    setPolygon(query.polygon)
    setUrl(query.desktopUrl)
    setUrlMobile(query.mobileUrl)
    setHrefImage(query.hrefImg)
    setIdImg(query.imageProtocolId)
  }, [query])

  let polygons: string[] = []
  const options: Option[] = []

  useEffect(() => {
    console.log('polygons: ', data)
  }, [data])

  if (data) {
    polygons = data.getPolygons.polygons
    for (let i = 0; i < polygons.length; i++) {
      options.push({ value: polygons[i], label: polygons[i] })
    }
  }

  const [postDataInfo, { data: data2, error }] = useMutation(POST_DataInfo)

  const [uploadFile] = useMutation<IncomingFile>(UPLOAD_mutation)

  const validateHref = (href: string) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gm
    const regExp = new RegExp(expression)

    return regExp.test(href)
  }

  const handleCustomerClassValue = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomerClassValue(e.target.value)
  }

  const handlePolygon = (e: ChangeEvent<HTMLInputElement>) => {
    setPolygon(e.target.value)
  }

  const handleHref = (e: ChangeEvent<HTMLInputElement>) => {
    setHrefImage(e.target.value)
  }

  const handleIdImgValue = (e: ChangeEvent<HTMLInputElement>) => {
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
      try {
        const resp = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        const { fileUrl } = resp.data.uploadFile

        setDesktopFileName(acceptedFiles[0].name)
        setUrl(fileUrl)
        setLoadingDesktopImg(false)
      } catch (e) {
        setError(true)
      }
    } else {
      setError(true)
    }
  }

  const handleMobileFile = async (acceptedFiles: File[]) => {
    setLoadingMobileImg(true)
    if (acceptedFiles?.[0]) {
      try {
        const resp = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        const { fileUrl } = resp.data.uploadFile

        setMobileFileName(acceptedFiles[0].name)
        setUrlMobile(fileUrl)
        setLoadingMobileImg(false)
      } catch (e) {
        setError(true)
      }
    } else {
      setError(true)
    }
  }

  const handleSubmit = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

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

    if (hrefImg) {
      // check if hrefImg is valid
      if (!validateHref(hrefImg)) {
        return
      }
    }

    postDataInfo({
      variables: {
        customerClassValue,
        polygon,
        url,
        urlMobile,
        hrefImg,
        idImg,
      },
    })

    if (error) {
      setError(true)
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

    navigate({
      to: '/admin/app/imageprotocol/list',
      query: 'updated=true',
    })

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
            <FormattedMessage id="admin/image-protocol.form.success" />
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
                id={`${styles.classname}`}
                type="text"
                pattern="^[A-Za-z0-9]*$"
                placeholder={intl.formatMessage({
                  id: 'admin/image-protocol.form.customer-class.label',
                })}
                size="Regular"
                label={intl.formatMessage({
                  id: 'admin/image-protocol.form.customer-class.label',
                })}
                value={customerClassValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleCustomerClassValue(e)
                }}
                helpText={intl.formatMessage({
                  id: 'admin/image-protocol.form.class-name.helpText',
                })}
              />
            </div>
            {options.length !== 0 && (
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
                <div className="mt4">
                  <Button href="/admin/iframe/logistics/#/geolocation">
                    <FormattedMessage id="admin/image-protocol.form.create-new-polygon.label" />
                  </Button>
                </div>
              </div>
            )}

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
                id={`${styles.hrefUrl}`}
                placeholder={intl.formatMessage({
                  id: 'admin/image-protocol.form.href.label',
                })}
                size="Regular"
                label={intl.formatMessage({
                  id: 'admin/image-protocol.form.href.label',
                })}
                required
                type="url"
                pattern="https?://.*"
                title="Url should start with http(s) "
                value={hrefImg}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleHref(e)
                }}
                helpText={intl.formatMessage({
                  id: 'admin/image-protocol.form.href.helpText',
                })}
              />
            </div>
            <div className="w-90 w-40-m">
              <Input
                id={`${styles.imageid}`}
                type="text"
                pattern="^[A-Za-z0-9]*$"
                placeholder="ID"
                size="Regular"
                label={intl.formatMessage({
                  id: 'admin/image-protocol.form.image-protocol-id.label',
                })}
                required
                value={idImg}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleIdImgValue(e)
                }}
              />
            </div>
            <div className="mt4" style={{ alignSelf: 'end' }}>
              <Button type="submit">
                <FormattedMessage id="admin/image-protocol.form.submit.label" />
              </Button>
            </div>
            {err === true && (
              <div className="mv5">
                <Alert
                  autoClose={3000}
                  onClose={() => {
                    setSuccess(false)
                    setError(false)
                  }}
                  type="error"
                >
                  <FormattedMessage id="admin/image-protocol.form.error" />
                </Alert>
              </div>
            )}
          </form>
        </PageBlock>
      </div>
    </Layout>
  )
}

export default CustomerClassInfo
