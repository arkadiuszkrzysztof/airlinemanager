import React, { type ReactElement } from 'react'
import { Card, Col } from 'react-bootstrap'
import type { IconProps } from 'react-bootstrap-icons'

interface ListPreviewProps<U> {
  Component: React.FC<{ item: U }>
  items: U[]
  header: string
  Icon?: React.FC<IconProps>
}

const ListPreview = <U,>({ Component, items, header, Icon }: ListPreviewProps<U>): ReactElement => {
  // const Component = component
  return (
    <Col xs={6} xl={5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center'>
          {Icon != null && <Icon size={24} className='text-dark me-2' />}
          <span className='text-dark fw-bold fs-5'>{header}</span>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2'>
            {items.map((item, index) => (
              <Component key={`list-preview-${index}`} item={item} />
            ))}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ListPreview
