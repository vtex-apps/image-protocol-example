/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import Dropzone from 'react-dropzone'
import {
  createSystem,
  Page,
  PageHeader,
  PageHeaderTop,
  PageHeaderTitle,
  Center,
  Button,
  Stack,
  TextInput,
  Text,
  Flex,
  Select,
  IconTrash,
  experimental_DatePickerField as DatePickerField,
  experimental_DatePickerCalendar as DatePickerCalendar,
  experimental_useDatePickerState as useDatePickerState,
  Switch,
  experimental_ComboboxMultipleField as ComboboxMultipleField,
  experimental_ComboboxMultiplePopover as ComboboxMultiplePopover,
  experimental_useComboboxMultipleState as useComboboxMultipleState,
} from '@vtex/admin-ui'
import { Spinner, Alert } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import EmptyState from './EmptyState'
import UPLOAD_mutation from './graphql/uploadFile.graphql'

const [CampaignProvider] = createSystem()

const messages = defineMessages({
  title: { id: 'admin/image-protocol.new-campaign' },
  submit: { id: 'admin/image-protocol.form.submit.label' },
  elementtype: { id: 'admin/image-protocol.form.element' },
  desktopimage: { id: 'admin/image-protocol.form.desktop-image.label' },
  mobileimage: { id: 'admin/image-protocol.form.mobile-image.label' },
  error: { id: 'admin/image-protocol.form.error' },
})

function CreateCampaign() {
  const { formatMessage } = useIntl()
  const dateState = useDatePickerState({
    formatOptions: {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      weekday: 'long',
    },
  })

  const [checked, setChecked] = useState(false)
  const [selection, setSelection] = useState('')
  const [err, setError] = useState(false)
  const [isLoadingDesktopImg, setLoadingDesktopImg] = useState(Boolean)
  const [isLoadingMobileImg, setLoadingMobileImg] = useState(Boolean)
  const [desktopFileName, setDesktopFileName] = useState('')
  const [mobileFileName, setMobileFileName] = useState('')
  const [url, setUrl] = useState('')
  const [urlMobile, setUrlMobile] = useState('')

  const combobox = useComboboxMultipleState({
    list: [
      { name: 'rule1', value: 'test', rule: 'customerclass' },
      { name: 'rule2', value: 'barcelona', rule: 'polygon' },
      { name: 'rule3', value: 'madrid', rule: 'polygon' },
      { name: 'rule4', value: 'sunny', rule: 'weather' },
    ],
    getOptionValue: (item) => item.name,
    renderOption: (item) => <>{item.name}</>,
    renderTag: (item) => item.name,
  })

  const elements = ['Image', 'Text']

  const [uploadFile] = useMutation<IncomingFile>(UPLOAD_mutation)

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

  return (
    <CampaignProvider>
      <Page>
        <PageHeader>
          <PageHeaderTop csx={{ justifyContent: 'center' }}>
            <PageHeaderTitle>{formatMessage(messages.title)}</PageHeaderTitle>
          </PageHeaderTop>
        </PageHeader>
        <Center csx={{ paddingY: '$xl' }}>
          <form>
            <TextInput
              label="Campaign Name"
              onChange={() => console.info('text')}
            />
            <Stack direction="row" csx={{ paddingTop: '$xl' }}>
              <>
                <DatePickerField label="Valid until" state={dateState} />
                <DatePickerCalendar state={dateState} />
              </>
              <Switch
                label="Is active?"
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
            </Stack>
            <Stack csx={{ paddingTop: '$xl' }}>
              <ComboboxMultipleField
                state={combobox}
                id="combobox-multiple"
                label="Rules"
                csx={{
                  width: '100%',
                }}
              />
              <ComboboxMultiplePopover state={combobox} />
              <Flex direction="column">
                {combobox.selectedItems.map((it) => (
                  <Flex key={it.name}>
                    <Flex
                      justify="start"
                      align="center"
                      csx={{ padding: '$m', width: '100px' }}
                    >
                      <>{it.name}</>
                    </Flex>

                    <Flex
                      justify="start"
                      align="center"
                      csx={{ padding: '$m', width: '100px' }}
                    >
                      <>{it.value}</>
                    </Flex>
                    <Flex
                      justify="start"
                      align="center"
                      csx={{ padding: '$m', width: '100px' }}
                    >
                      <>{it.rule}</>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Stack>
            <Stack csx={{ paddingY: '$xl' }}>
              <Select
                label={formatMessage(messages.elementtype)}
                value={selection}
                onChange={(e: any) => setSelection(e.target.value)}
              >
                {elements.map((element) => (
                  <option key={element} value={element}>
                    {element}
                  </option>
                ))}
              </Select>
              {selection === 'Image' && (
                <>
                  <TextInput label="Content Id" />
                  <>
                    <Text>{formatMessage(messages.desktopimage)}</Text>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleDesktopFile(acceptedFiles)
                      }
                      accept="image/*"
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="w-90 w-40-m">
                          <div
                            {...getRootProps()}
                            className={` ${
                              isLoadingDesktopImg && 'b--mid-gray'
                            }`}
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
                      <Flex direction="column">
                        <img src={url} alt={desktopFileName} />
                        <button onClick={removeDesktopFile}>
                          <IconTrash />
                        </button>
                      </Flex>
                    )}
                  </>
                  <>
                    <Text>{formatMessage(messages.mobileimage)}</Text>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleMobileFile(acceptedFiles)
                      }
                      accept="image/*"
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="w-90 w-40-m">
                          <div
                            {...getRootProps()}
                            className={` ${
                              isLoadingMobileImg && 'b--mid-gray'
                            }`}
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
                      <Flex direction="column">
                        <img src={urlMobile} alt={mobileFileName} />
                        <button onClick={removeMobileFile}>
                          <IconTrash />
                        </button>
                      </Flex>
                    )}
                  </>
                  <TextInput label="Url" />
                </>
              )}
              {selection === 'Text' && (
                <>
                  <TextInput label="Content Id" />
                </>
              )}
            </Stack>
            <Button type="submit">{formatMessage(messages.submit)}</Button>
            {err === true && (
              <div className="mv5">
                <Alert
                  autoClose={3000}
                  onClose={() => {
                    setError(false)
                  }}
                  type="error"
                >
                  {formatMessage(messages.error)}
                </Alert>
              </div>
            )}
          </form>
        </Center>
      </Page>
    </CampaignProvider>
  )
}

export default CreateCampaign
