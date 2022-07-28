import React from 'react'
import { defineMessages, useIntl } from 'react-intl'

import styles from './styles.css'

interface EmptyStateProps {
  fileName: string
}

const messages = defineMessages({
  dropzone: { id: 'admin/image-protocol.dropzone.text' },
})

const EmptyState = ({ fileName }: EmptyStateProps) => {
  const { formatMessage } = useIntl()

  return (
    <div
      className={`flex justify-center align-center items-center ${styles.emptyStateContainer}`}
    >
      <div
        className={`h-100 flex flex-column justify-center items-center pointer b--mid-gray b--dashed ba br2 c-muted-1 ${styles.emptyState}`}
      >
        {fileName !== '' ? (
          <div className={`tc ${styles.imageUploaderText}`}>{fileName}</div>
        ) : (
          <div>{formatMessage(messages.dropzone)}</div>
        )}
      </div>
    </div>
  )
}

export default React.memo(EmptyState)
