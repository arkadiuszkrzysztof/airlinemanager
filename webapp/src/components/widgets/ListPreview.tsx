import React, { type ReactElement } from 'react'
import { Card, Col } from 'react-bootstrap'
import type { IconProps } from 'react-bootstrap-icons'

interface ListPreviewProps<U> {
  Component: React.FC<{ item: U }>
  items: U[]
  header: string
  subheader?: string
  Icon?: React.FC<IconProps>
  fullWidth?: boolean
}

const ListPreview = <U,>({ Component, items, header, Icon, subheader, fullWidth = false }: ListPreviewProps<U>): ReactElement => {
  return (
    <Col xs={12} md={11} lg={9} xl={8} xxl={fullWidth ? 10 : 5} xxxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            {Icon != null && <Icon size={24} className='text-dark me-2' />}
            <span className='text-dark fw-bold fs-5'>{header}</span>
          </div>
          <span className='text-primary fs-6'>{subheader}</span>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2'>
            {items.map((item, index) => (
              <Component key={`list-preview-${index}`} item={item} />
            ))}
            {items.length === 0 && <h4 className='text-center text-grey-dark mt-2'>{`No items in the ${header}`}</h4>}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ListPreview
