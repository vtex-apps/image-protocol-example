import React from 'react'
import { FormattedMessage } from 'react-intl'

import styles from './styles.css'

interface EmptyStateProps {
  fileName: string
}
const EmptyState = ({ fileName }: EmptyStateProps) => {
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
          <div>
            <FormattedMessage id="admin/image-protocol.dropzone.text" />
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(EmptyState)
