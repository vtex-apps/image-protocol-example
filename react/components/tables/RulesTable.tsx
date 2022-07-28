/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import type { DropResult } from 'react-beautiful-dnd'
import {
  Table,
  IconDotsSixVertical,
  TableHead,
  useTableState,
  TableBody,
  TableBodyRow,
  IconPencil,
  IconTrash,
  MenuItem,
} from '@vtex/admin-ui'

const fakeData = [
  {
    id: 0,
    name: 'Rule 1',
    value: 'test',
    rule: 'Customer Class',
    position: 1,
  },
  {
    id: 1,
    name: 'Rule 2',
    value: 'From 7:00 to 11:00',
    rule: 'Time of Day',
    position: 2,
  },
  {
    id: 2,
    name: 'Rule 3',
    value: 'Barcelona',
    rule: 'Polygon',
    position: 3,
  },
]

function RulesTable() {
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
        id: 'value',
        header: 'Value',
        width: 100,
      },
      {
        id: 'rule',
        header: 'Rule Type',
        width: 100,
      },
      {
        id: 'menu',
        header: 'Actions',
        width: 50,
        resolver: {
          type: 'root',
          render: function Actions() {
            return (
              <>
                <MenuItem label icon={<IconPencil />} onClick={() => {}} />
                <MenuItem
                  label
                  icon={<IconTrash />}
                  critical
                  onClick={() => {}}
                />
              </>
            )
          },
        },
      },
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
    <>
      <Table state={state} csx={{ margin: '3% auto', width: '80%' }}>
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
    </>
  )
}

export default RulesTable
