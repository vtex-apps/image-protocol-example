/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import type { DropResult } from 'react-beautiful-dnd'
import {
  createSystem,
  Page,
  Table,
  IconDotsSixVertical,
  TableHead,
  useTableState,
  TableBody,
  TableBodyRow,
  /* IconPencil,
  IconTrash, */
} from '@vtex/admin-ui'

const [TableProvider] = createSystem()

const fakeData = [
  {
    id: 0,
    name: 'Campaign 1',
    valid: '10/02/2023',
    active: 'true',
    rule: 'RuleSet1',
    position: 1,
  },
  {
    id: 1,
    name: 'Campaign 2',
    valid: '10/09/2022',
    active: 'true',
    rule: 'RuleSet2',
    position: 2,
  },
  {
    id: 2,
    name: 'Campaign 3',
    valid: '01/01/2023',
    active: 'true',
    rule: 'RuleSet3',
    position: 3,
  },
  {
    id: 3,
    name: 'Campaign 4',
    valid: '10/02/2023',
    active: 'true',
    rule: 'RuleSet1',
    position: 4,
  },
]

/* interface Item {
  id: number
  name: string
  valid: string
  active: string
  rule: string
  position: number
} */
function CampaignTable() {
  const [items, setItems] = useState(fakeData)
  const state = useTableState({
    columns: [
      {
        id: 'draggable',
        header: '',
        width: 36,
        resolver: {
          type: 'root',
          render: function RenderIcon() {
            return <IconDotsSixVertical />
          },
        },
      },
      {
        id: 'position',
        header: 'Piority',
        width: 100,
      },
      {
        id: 'name',
        width: 100,
        header: 'Name',
      },
      {
        id: 'valid',
        header: 'Valid Until',
        width: 100,
      },
      {
        id: 'active',
        header: 'Is Active',
        width: 100,
      },
      {
        id: 'rule',
        header: 'Rule Set',
        width: 100,
      },
      /* {
        id: 'menu',
        resolver: {
          type: 'menu',
          actions: [
            {
              label: 'Edit',
              icon: <IconPencil />,
              onClick: (item: Item) => {
                console.info(item)
              },
            },
            {
              label: 'Delete',
              icon: <IconTrash />,
              onClick: (item: Item) => {
                setItems(items.filter((i) => i.id !== item.id))
              },
            },
          ],
        },
      }, */
    ],
    items,
  })

  function reorder(list: any[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const firstPosition = result[0].position

    const [removed] = result.splice(startIndex, 1)

    result.splice(endIndex, 0, removed)

    result.forEach((item, index) => {
      item.position = firstPosition + index
    })

    return result
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return
    }

    const orderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    )

    setItems(orderedItems)
  }

  return (
    <TableProvider>
      <Page>
        <Table state={state}>
          <TableHead />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <TableBody ref={droppableProvided.innerRef}>
                  {(renderRow: any) => (
                    <>
                      {renderRow(({ key, item, index }: any) => (
                        <Draggable draggableId={key} index={index}>
                          {(draggableProvided, draggableSnapshot) => (
                            <TableBodyRow
                              id={key}
                              item={item}
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              csx={{
                                ...draggableProvided.draggableProps.style,
                                boxShadow: draggableSnapshot.isDragging
                                  ? 'menu'
                                  : 'none',
                              }}
                            />
                          )}
                        </Draggable>
                      ))}
                      {droppableProvided.placeholder}
                    </>
                  )}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </Page>
    </TableProvider>
  )
}

export default CampaignTable
