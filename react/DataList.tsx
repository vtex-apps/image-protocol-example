/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Table, Button } from 'vtex.styleguide'
import { useQuery, useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import GET_DATA_LIST from './graphql/getDataList.graphql'
import REMOVE_FROM_LIST from './graphql/removeFromList.graphql'

interface TableItem {
  cellData: unknown
  rowData: DataInfo
  updateCellMeasurements: () => void
}

interface DataInfo {
  customerClass: string
  polygon: string
  imageProtocolId: string
  desktopUrl: string
  mobileUrl: string
  hrefImg: string
}
const DataList: FC = () => {
  const { navigate, query } = useRuntime()

  const [list, setList] = useState<DataInfo[]>([])
  const [updated, setUpdated] = useState(false)
  const { data, loading, error, refetch } = useQuery(GET_DATA_LIST)

  useEffect(() => {
    console.info('query: ', query)
    const isEmpty = Object.keys(query).length === 0

    if (isEmpty) {
      return
    }

    setUpdated(query.updated)
    console.log('updated: ', updated)
    refetch()
  }, [query, updated, refetch])

  useEffect(() => {
    console.log('loading:', loading)
    console.log('error2:', error)
    console.log('data saved in vbase: ', data)
    if (data) {
      setList(data.getDataList)
    }
  }, [data, loading, error])

  const [
    removeFromList,
    { data: data2, loading: loading2, error: error2 },
  ] = useMutation(REMOVE_FROM_LIST)

  const lineActions = [
    {
      label: () => `Edit`,
      onClick: ({ rowData }: TableItem) => {
        navigate({
          to: '/admin/app/imageprotocol/protocol',
          query: `customerClass=${rowData.customerClass}&polygon=${rowData.polygon}&imageProtocolId=${rowData.imageProtocolId}&desktopUrl=${rowData.desktopUrl}&mobileUrl=${rowData.mobileUrl}&hrefImg=${rowData.hrefImg}`,
        })
      },
    },
    {
      label: () => `Delete`,
      isDangerous: true,
      onClick: ({ rowData }: TableItem) => {
        const { customerClass, polygon, imageProtocolId } = rowData

        console.info(
          'on click to delete: ',
          customerClass,
          ' ',
          polygon,
          ' ',
          imageProtocolId
        )
        removeFromList({
          variables: { customerClass, polygon, imageProtocolId },
        })

        if (loading2) {
          console.log('loading')
        }

        if (error2) {
          console.log('error: ', error2)
        }

        console.info('data: ', data2)
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
        console.log('updated list:', updatedList)
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
          return <img src={cellData} alt="desktop url" />
        },
      },
      mobileUrl: {
        title: 'Mobile URL',
        cellRenderer: ({ cellData }: any) => {
          return <img src={cellData} alt="mobile url" />
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
                <h1>
                  <FormattedMessage id="admin/image-protocol.table-no-data" />
                </h1>
              </div>
            )}
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
