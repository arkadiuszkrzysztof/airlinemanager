import React from 'react'
import { Row, Col, Badge } from 'react-bootstrap'
import { type HangarAsset } from '../controllers/HangarController'

interface Props {
  item: HangarAsset
}

const HangarListItem: React.FC<Props> = ({ item }) => {
  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <Col xs={8}>
        <div className='d-flex align-items-center'>
          {item.plane.getIdentification()}
          <Badge bg={item.ownership === 'owned' ? 'dark' : 'light'} className='ms-2'>
            {item.ownership.toUpperCase()}
          </Badge>
        </div>
        <p>{item.plane.introduce()}</p>
      </Col>
      <Col xs={4} className='d-flex flex-column justify-content-center'>
        Nothing to see here...
      </Col>
    </Row>
  )
}

export default HangarListItem
