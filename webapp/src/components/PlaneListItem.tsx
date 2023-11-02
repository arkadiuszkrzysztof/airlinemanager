import React from 'react'
import { type Plane } from '../models/Plane'
import { Row, Col, Button } from 'react-bootstrap'

interface Props {
  item: Plane
}

const PlaneListItem: React.FC<Props> = ({ item }) => {
  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <Col xs={6}>
        <div>{item.introduce()}</div>
        <div>Age: {Math.round(Math.abs(item.manufacturedWeek) / 52)}</div>
        <div>Registration: {item.registration}</div>
        <div>Range: {item.maxRange}</div>
        <div>Capacity: {item.maxSeating.economy + item.maxSeating.business + item.maxSeating.first}</div>
      </Col>
      <Col xs={6} className='d-flex flex-column justify-content-center'>
        <Button variant="outline-primary">Buy for {item.getPricing().purchase}</Button>
        <Button variant="outline-primary" className='mt-2'>
          <small>Lease for {item.getPricing().lease} / FH<br />
          + {item.getPricing().downpayment} down payment</small>
        </Button>
        <div className='mt-2 mb-0 fs-6 text-center'><small>Maintenance: {item.getPricing().maintenance} / FH</small></div>
      </Col>
    </Row>
  )
}

export default PlaneListItem
