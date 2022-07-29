/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  Select,
  Stack,
  TextInput,
  Flex,
  FlexSpacer,
} from '@vtex/admin-ui'
import type { useModalState } from '@vtex/admin-ui'

const messages = defineMessages({
  title: { id: 'admin/image-protocol.new-rule' },
  ruletype: { id: 'admin/image-protocol.table.rule-types' },
  submit: { id: 'admin/image-protocol.form.submit.label' },
  create: { id: 'admin/image-protocol.form.create-new-polygon.label' },
})

const ModalRule = ({ state }: { state: ReturnType<typeof useModalState> }) => {
  const { formatMessage } = useIntl()

  const [selection, setSelection] = useState('')
  const [customer, setCustomer] = useState('')
  const [polygon, setPolygon] = useState('')
  const [time, setTime] = useState('')
  const [weather, setWeather] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.info(
      'selection: ',
      selection,
      ' customer: ',
      customer,
      ' polygon: ',
      polygon,
      ' time: ',
      time,
      ' weather: ',
      weather
    )
  }

  const ruletypes = ['Customer Class', 'Polygon', 'Time of day', 'Weather']
  const locations = ['Barcelona', 'Madrid', 'Valencia']
  const climate = ['Sunny', 'Ranny', 'Snow', 'Windy']

  return (
    <Modal aria-label="select-rule-type" state={state}>
      <ModalHeader title={formatMessage(messages.title)} />
      <ModalContent>
        <form
          onSubmit={(e) => {
            handleSubmit(e)
          }}
        >
          <Stack space="$2xl">
            <Select
              label={formatMessage(messages.ruletype)}
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
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
                  label="Customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </>
            )}
            {selection === 'Polygon' && (
              <Flex align="end">
                <Select
                  label="Polygon"
                  value={polygon}
                  onChange={(e) => setPolygon(e.target.value)}
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </Select>
                <FlexSpacer csx={{ width: '50px' }} />
                <Button>{formatMessage(messages.create)}</Button>
              </Flex>
            )}
            {selection === 'Time of day' && (
              <>
                <TextInput
                  label="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </>
            )}
            {selection === 'Weather' && (
              <>
                <Select
                  label="Weather"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
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
      </ModalContent>
    </Modal>
  )
}

export default ModalRule
