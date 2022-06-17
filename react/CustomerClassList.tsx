/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Table } from 'vtex.styleguide'
import { useQuery, useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import GET_CUSTOMERCLASS_LIST from './graphql/customerClassList.graphql'
import REMOVE_FROM_CUSTOMERCLASS_LIST from './graphql/removeFromList.graphql'

interface TableItem {
  cellData: unknown
  rowData: CustomerClassInfo
  updateCellMeasurements: () => void
}

interface CustomerClassInfo {
  customerClass: string
  imageProtocolId: string
  desktopUrl: string
  mobileUrl: string
}
const CustomerClassList: FC = () => {
  const { navigate } = useRuntime()
  const [list, setList] = useState([])
  const [
    removeFromList,
    { data: data2, loading: loading2, error: error2 },
  ] = useMutation(REMOVE_FROM_CUSTOMERCLASS_LIST)

  const lineActions = [
    {
      label: () => `Edit`,
      onClick: ({ rowData }: TableItem) => {
        navigate({
          to: '/admin/app/imageprotocol/protocol',
          query: `customerClass=${rowData.customerClass}&imageProtocolId=${rowData.imageProtocolId}&desktopUrl=${rowData.desktopUrl}&mobileUrl=${rowData.mobileUrl}`,
        })
      },
    },
    {
      label: () => `Delete`,
      isDangerous: true,
      onClick: ({ rowData }: TableItem) => {
        const { customerClass, imageProtocolId } = rowData

        removeFromList({
          variables: { customerClass, imageProtocolId },
        })

        if (loading2) {
          console.log('loading')
        }

        if (error2) {
          console.log('error: ', error2)
        }

        console.info('data: ', data2)
        const updatedList = list.filter(
          (row: CustomerClassInfo) =>
            row.customerClass !== rowData.customerClass
        )

        setList(updatedList)
        console.log('updated list:', updatedList)
      },
    },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMERCLASS_LIST)

  useEffect(() => {
    console.log('loading:', loading)
    console.log('error2:', error)
    console.log('data saved in vbase: ', data)
    if (data) {
      setList(data.customerClassList)
    }
  }, [data, loading, error])

  const dataSchema = {
    properties: {
      customerClass: {
        title: 'Customer Class',
        minWidth: 50,
      },
      imageProtocolId: {
        title: 'Image Protocol Id',
        minWidth: 50,
      },
      desktopUrl: {
        title: 'Desktop URL',
        cellRenderer: ({ cellData }: any) => {
          return <img src={cellData} alt="desktop url" />
        },
      },
      mobileUrl: {
        title: 'Mobile URL',
        cellRenderer: ({ cellData }: any) => {
          return <img src={cellData} alt="mobile url" />
        },
      },
    },
  }

  return (
    <Layout fullWidth>
      <div className="bg-muted-5 pa8">
        <PageBlock
          title={
            <FormattedMessage id="admin/image-protocol.navigation.label-infolist" />
          }
        >
          <div className="mt4 mb4">
            {list ? (
              <Table
                fullWidth
                schema={dataSchema}
                items={list}
                density="high"
                dynamicRowHeight
                lineActions={lineActions}
              />
            ) : (
              <div>
                <h1>No data to display</h1>
              </div>
            )}
          </div>
        </PageBlock>
      </div>
    </Layout>
  )
}

export default CustomerClassList
