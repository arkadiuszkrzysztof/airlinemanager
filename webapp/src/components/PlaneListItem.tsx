import React from 'react'
import { type Plane } from '../models/Plane'
import { Row, Col, Button } from 'react-bootstrap'
import { GameController } from '../controllers/GameController'

interface Props {
  item: Plane
}

const PlaneListItem: React.FC<Props> = ({ item: plane }) => {
  const Controllers = GameController.getInstance()

  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <Col xs={6}>
        <div>{plane.introduce()}</div>
        <div>Age: {Math.round(Math.abs(plane.manufacturedWeek) / 52)}</div>
        <div>Registration: {plane.registration}</div>
        <div>Range: {plane.maxRange}</div>
        <div>Capacity: {plane.maxSeating.economy + plane.maxSeating.business + plane.maxSeating.first}</div>
      </Col>
      <Col xs={6} className='d-flex flex-column justify-content-center'>
        <Button
          variant="outline-primary"
          onClick={ () => { Controllers.Airline.buyPlane(plane) }}
        >
          Buy for {plane.getPricing().purchase}
        </Button>
        <Button
          variant="outline-primary"
          className='mt-2'
          onClick={ () => { Controllers.Airline.leasePlane(plane) }}
        >
          <small>Lease for {plane.getPricing().lease} / FH<br />
          + {plane.getPricing().downpayment} down payment</small>
        </Button>
        <div className='mt-2 mb-0 fs-6 text-center'><small>Maintenance: {plane.getPricing().maintenance} / FH</small></div>
      </Col>
    </Row>
  )
}

export default PlaneListItem
