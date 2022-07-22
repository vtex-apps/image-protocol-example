/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Table, Button } from 'vtex.styleguide'
import { useQuery, useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import GET_DATA_LIST from './graphql/getDataList.graphql'
import REMOVE_FROM_LIST from './graphql/removeFromList.graphql'

const DataList: FC = () => {
  const { navigate, query } = useRuntime()

  const [list, setList] = useState<DataInfo[]>([])
  const [updated, setUpdated] = useState(false)
  const { data, loading, refetch } = useQuery(GET_DATA_LIST)

  useEffect(() => {
    const isEmpty = Object.keys(query).length === 0

    if (isEmpty) {
      return
    }

    setUpdated(query.updated)
    refetch()
  }, [query, updated, refetch])

  useEffect(() => {
    if (data) setList(data.getDataList)
  }, [data])

  const [removeFromList] = useMutation(REMOVE_FROM_LIST)

  const lineActions = [
    {
      label: () => <FormattedMessage id="admin/image-protocol.table.edit" />,
      onClick: ({ rowData }: TableItem) => {
        navigate({
          to: '/admin/app/imageprotocol/protocol',
          query: `customerClass=${rowData.customerClass}&polygon=${rowData.polygon}&imageProtocolId=${rowData.imageProtocolId}&desktopUrl=${rowData.desktopUrl}&mobileUrl=${rowData.mobileUrl}&hrefImg=${rowData.hrefImg}`,
        })
      },
    },
    {
      label: () => <FormattedMessage id="admin/image-protocol.table.delete" />,
      isDangerous: true,
      onClick: ({ rowData }: TableItem) => {
        const { customerClass, polygon, imageProtocolId } = rowData

        removeFromList({
          variables: { customerClass, polygon, imageProtocolId },
        })

        let key = ''
        let rowKey = ''
        const updatedList: DataInfo[] = []

        list.forEach((row: DataInfo) => {
          if (rowData.customerClass.length > 0 && rowData.polygon.length > 0) {
            key = `${rowData.customerClass}-${rowData.polygon}-${rowData.imageProtocolId}`
          } else if (
            rowData.customerClass.length > 0 &&
            rowData.polygon.length === 0
          ) {
            key = `${rowData.customerClass}-empty-${rowData.imageProtocolId}`
          } else if (
            rowData.polygon.length > 0 &&
            rowData.customerClass.length === 0
          ) {
            key = `empty-${rowData.polygon}-${rowData.imageProtocolId}`
          }

          if (row.customerClass.length > 0 && row.polygon.length > 0) {
            rowKey = `${row.customerClass}-${row.polygon}-${row.imageProtocolId}`
          } else if (row.customerClass.length > 0 && row.polygon.length === 0) {
            rowKey = `${row.customerClass}-empty-${row.imageProtocolId}`
          } else if (row.polygon.length > 0 && row.customerClass.length === 0) {
            rowKey = `empty-${row.polygon}-${row.imageProtocolId}`
          }

          if (key !== rowKey) {
            updatedList.push(row)
          }
        })
        setList(updatedList)
      },
    },
  ]

  const dataSchema = {
    properties: {
      customerClass: {
        title: 'Customer Class',
        minWidth: 50,
      },
      polygon: {
        title: 'Polygon',
        minWidth: 50,
      },
      imageProtocolId: {
        title: 'Image Protocol Id',
        minWidth: 50,
      },
      desktopUrl: {
        title: 'Desktop URL',
        cellRenderer: ({ cellData }: any) => {
          return (
            <img src={cellData} alt="desktop url" style={{ height: '100px' }} />
          )
        },
      },
      mobileUrl: {
        title: 'Mobile URL',
        cellRenderer: ({ cellData }: any) => {
          return (
            <img src={cellData} alt="mobile url" style={{ height: '100px' }} />
          )
        },
      },
      hrefImg: {
        title: 'Link url',
        minWidth: 50,
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
            <Table
              loading={loading}
              fullWidth
              schema={dataSchema}
              items={list}
              dynamicRowHeight
              lineActions={lineActions}
              emptyStateLabel={
                <FormattedMessage id="admin/image-protocol.table-no-data" />
              }
            />
          </div>
        </PageBlock>
        <div>
          <Button href="/admin/app/imageprotocol/protocol">
            <FormattedMessage id="admin/image-protocol.create-new" />
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default DataList
