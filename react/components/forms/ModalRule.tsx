/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  useModalState,
  Stack,
} from '@vtex/admin-ui'
import { Form, useFormState, Select } from '@vtex/admin-ui-form'

const messages = defineMessages({
  title: { id: 'admin/image-protocol.new-rule' },
  ruletype: { id: 'admin/image-protocol.table.rule-types' },
  submit: { id: 'admin/image-protocol.form.submit.label' },
})

function ModalRule() {
  const { formatMessage } = useIntl()
  const modal = useModalState({ visible: false })
  const form = useFormState()

  const handleSubmit = (data: any) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data))
  }

  return (
    <Modal aria-label="select-rule-type" state={modal}>
      <ModalHeader title={formatMessage(messages.title)} />
      <ModalContent>
        <Form state={form} onSubmit={handleSubmit} csx={{ margin: '2% 5%' }}>
          <Stack space="$2xl">
            <Select
              label={formatMessage(messages.ruletype)}
              name="rule"
              state={form}
            >
              <option value="customerclass">Customer Class</option>
              <option value="polygon">Polygon</option>
              <option value="time">Time of day</option>
              <option value="weather">Weather</option>
            </Select>

            <Button type="submit">{formatMessage(messages.submit)}</Button>
          </Stack>
        </Form>
      </ModalContent>
    </Modal>
  )
}

export default ModalRule
