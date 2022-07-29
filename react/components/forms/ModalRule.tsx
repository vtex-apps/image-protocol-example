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

  const handleSubmit = (data: any) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data))
  }

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
              <option value="customerclass">Customer Class</option>
              <option value="polygon">Polygon</option>
              <option value="time">Time of day</option>
              <option value="weather">Weather</option>
            </Select>
            {selection === 'customerclass' && (
              <>
                <TextInput
                  label="Customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </>
            )}
            {selection === 'polygon' && (
              <Flex align="end">
                <Select
                  label="Polygon"
                  value={polygon}
                  onChange={(e) => setPolygon(e.target.value)}
                >
                  <option value="barcelona">Barcelona</option>
                  <option value="madrid">Madrid</option>
                  <option value="valencia">Valencia</option>
                </Select>
                <FlexSpacer csx={{ width: '50px' }} />
                <Button>{formatMessage(messages.create)}</Button>
              </Flex>
            )}
            {selection === 'time' && (
              <>
                <TextInput
                  label="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </>
            )}
            {selection === 'weather' && (
              <>
                <Select
                  label="Weather"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                >
                  <option value="sun">Sunny</option>
                  <option value="rain">Rainy</option>
                  <option value="snow">Snow</option>
                  <option value="windy">Windy</option>
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
