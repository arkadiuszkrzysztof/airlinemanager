import React, { useState, type ReactElement, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import type { IconProps } from 'react-bootstrap-icons'

interface ListPreviewProps<U> {
  Component: React.FC<{ item: U }>
  items: U[]
  header: string
  counter?: string
  subheader?: ReactElement | string
  Icon?: React.FC<IconProps>
  fullWidth?: boolean
  fullHeight?: boolean
  maxHeight?: string
  wrapItems?: boolean
  FilterSection?: React.FC<{ filter: string, setFilter: (filter: string) => void, items: U[], setFilteredItems: (items: U[]) => void }>
}

const ListPreviewWidget = <U,>({ Component, items, header, counter, Icon, subheader, fullWidth = false, fullHeight = false, maxHeight, wrapItems = false, FilterSection }: ListPreviewProps<U>): ReactElement => {
  const [filter, setFilter] = useState<string>('')
  const [filteredItems, setFilteredItems] = useState<U[]>([])

  useEffect(() => {
    if (FilterSection === undefined) {
      setFilteredItems(items)
    }
  }, [items])

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 widget-shadow' >
        <Card.Header className='position-sticky'>
          <Col xs={12} className='d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              {Icon != null && <Icon size={24} className='text-dark mx-2' />}
              <span className='text-dark fw-bold fs-5'>{`${header} ${counter ?? ''}`}</span>
            </div>
            <span className='text-primary fs-6'>{subheader}</span>
          </Col>
          <Col xs={12}>
            {FilterSection != null && <FilterSection filter={filter} setFilter={(filter: string) => { setFilter(filter) }} items={items} setFilteredItems={(newItems: U[]) => { setFilteredItems(newItems) }} />}
          </Col>
        </Card.Header>
        <Card.Body className={`d-flex overflow-auto pt-0 pb-2 ${fullHeight ? (FilterSection !== undefined ? 'widget-full-height-filter' : 'widget-full-height') : (maxHeight !== undefined ? '' : 'mh-350')} ${wrapItems ? 'flex-row flex-wrap' : 'flex-column'}`} style={{ maxHeight: (maxHeight ?? '') }}>
          {filteredItems.map((item, index) => (
            <Component key={`list-preview-${index}`} item={item} />
          ))}
          {filteredItems.length === 0 && <h4 className='text-center text-grey-dark mt-2 w-100'>{`No items in ${header}`}</h4>}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ListPreviewWidget
