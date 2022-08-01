/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import {
  createSystem,
  Page,
  PageHeader,
  PageHeaderTop,
  PageHeaderTitle,
  Select,
  Stack,
  TextInput,
  Flex,
  FlexSpacer,
  Anchor,
  Button,
  Center,
} from '@vtex/admin-ui'

const [RuleProvider] = createSystem()

const messages = defineMessages({
  title: { id: 'admin/image-protocol.new-rule' },
  ruletype: { id: 'admin/image-protocol.table.rule-types' },
  submit: { id: 'admin/image-protocol.form.submit.label' },
  create: { id: 'admin/image-protocol.form.create-new-polygon.label' },
})

function CreateRule() {
  const { formatMessage } = useIntl()

  const [selection, setSelection] = useState('')
  const [time, setTime] = useState({ from: '', to: '' })
  const [customer, setCustomer] = useState('')
  const [polygon, setPolygon] = useState('')
  const [weather, setWeather] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.info(
      'selection: ',
      selection,
      'time: ',
      time,
      ' customer: ',
      customer,
      ' polygon: ',
      polygon,
      ' weather: ',
      weather
    )
  }

  const ruletypes = ['Customer Class', 'Polygon', 'Time of day', 'Weather']
  const locations = ['Barcelona', 'Madrid', 'Valencia']
  const climate = ['Sunny', 'Ranny', 'Snow', 'Windy']

  return (
    <RuleProvider>
      <Page>
        <PageHeader>
          <PageHeaderTop csx={{ justifyContent: 'center' }}>
            <PageHeaderTitle>{formatMessage(messages.title)}</PageHeaderTitle>
          </PageHeaderTop>
        </PageHeader>
        <Center csx={{ paddingY: '$xl' }}>
          <form
            onSubmit={(e) => {
              handleSubmit(e)
            }}
          >
            <Stack space="$2xl">
              <Select
                label={formatMessage(messages.ruletype)}
                value={selection}
                onChange={(e: any) => setSelection(e.target.value)}
              >
                {ruletypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              {selection === 'Customer Class' && (
                <>
                  <TextInput
                    label="Customer Class"
                    value={customer}
                    onChange={(e: any) => setCustomer(e.target.value)}
                  />
                </>
              )}
              {selection === 'Polygon' && (
                <Flex align="end">
                  <Select
                    label="Polygon"
                    value={polygon}
                    onChange={(e: any) => setPolygon(e.target.value)}
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </Select>
                  <FlexSpacer csx={{ width: '50px' }} />
                  <Anchor href="/admin/iframe/logistics/#/geolocation">
                    <Button>{formatMessage(messages.create)}</Button>
                  </Anchor>
                </Flex>
              )}
              {selection === 'Time of day' && (
                <>
                  <TextInput
                    label="From"
                    onChange={({ target }) =>
                      setTime((state) => ({ ...state, from: target.value }))
                    }
                    value={time?.from}
                  />
                  <TextInput
                    label="to"
                    onChange={({ target }) =>
                      setTime((state) => ({ ...state, to: target.value }))
                    }
                    value={time?.to}
                  />
                </>
              )}
              {selection === 'Weather' && (
                <>
                  <Select
                    label="Weather"
                    value={weather}
                    onChange={(e: any) => setWeather(e.target.value)}
                  >
                    {climate.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </Select>
                </>
              )}
              <Button type="submit">{formatMessage(messages.submit)}</Button>
            </Stack>
          </form>
        </Center>
      </Page>
    </RuleProvider>
  )
}

export default CreateRule
