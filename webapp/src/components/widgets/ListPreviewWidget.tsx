import React, { useState, type ReactElement, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import type { IconProps } from 'react-bootstrap-icons'

interface ListPreviewProps<U> {
  Component: React.FC<{ item: U }>
  items: U[]
  header: string
  subheader?: string
  Icon?: React.FC<IconProps>
  fullWidth?: boolean
  fullHeight?: boolean
  wrapItems?: boolean
  FilterSection?: React.FC<{ items: U[], filter: (items: U[]) => void }>
}

const ListPreviewWidget = <U,>({ Component, items, header, Icon, subheader, fullWidth = false, fullHeight = false, wrapItems = false, FilterSection }: ListPreviewProps<U>): ReactElement => {
  const [filteredItems, setFilteredItems] = useState<U[]>([])

  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            {Icon != null && <Icon size={24} className='text-dark me-2' />}
            <span className='text-dark fw-bold fs-5'>{header}</span>
          </div>
          <span className='text-primary fs-6'>{subheader}</span>
        </Card.Header>
        <Card.Body className={`d-flex overflow-auto pt-0 pb-2 ${fullHeight ? 'widget-full-height' : 'mh-350'} ${wrapItems ? 'flex-row flex-wrap' : 'flex-column'}`}>
          {FilterSection != null && <FilterSection items={items} filter={(newItems: U[]) => { setFilteredItems(newItems) }} />}
          {filteredItems.map((item, index) => (
            <Component key={`list-preview-${index}`} item={item} />
          ))}
          {filteredItems.length === 0 && <h4 className='text-center text-grey-dark mt-2'>{`No items in the ${header}`}</h4>}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ListPreviewWidget
