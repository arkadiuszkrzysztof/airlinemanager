import React from 'react'
import { type Plane } from '../models/Plane'
import { Row, Col, Button } from 'react-bootstrap'
import { GameController } from '../controllers/GameController'
import { CalendarWeekFill, Cash, PersonFill, PinMapFill, TagFill } from 'react-bootstrap-icons'

interface Props {
  item: Plane
}

const MarketListItem: React.FC<Props> = ({ item: plane }) => {
  const Controllers = GameController.getInstance()

  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <Col xs={6}>
        <div><span className='fs-4 fw-bold text-primary'>{`${plane.familyName} ${plane.typeName}`}</span></div>
        <div className='d-flex flex-row justify-items-center align-items-center'>
          <Col xs={'auto'}><PersonFill size={40} className='text-grey-dark me-2' /></Col>
          <Col xs={'auto'}>
            <strong>{`${plane.maxSeating.economy + plane.maxSeating.business + plane.maxSeating.first} seats`}</strong><br />
            <span className='text-grey-dark small'>{`Economy: ${plane.maxSeating.economy} ● Business: ${plane.maxSeating.business} ● First: ${plane.maxSeating.first}`}</span>
          </Col>
        </div>
        <div className='d-flex align-items-center'>
          <TagFill size={20} className='text-grey-dark me-2' />
          {plane.registration}
        </div>
        <div className='d-flex align-items-center'>
          <PinMapFill size={20} className='text-grey-dark me-2' />
          {`${plane.maxRange} km`}
        </div>
        <div className='d-flex align-items-center'>
          <CalendarWeekFill size={20} className='text-grey-dark me-2' />
          <span><strong>{plane.getAge()}</strong> old</span>
        </div>
        <div className='d-flex align-items-center'>
          <Cash size={20} className='text-grey-dark me-2' />
          <span>Maintenance: <strong>{plane.getPricingFormatted().maintenance} / flight hour</strong></span>
        </div>
      </Col>
      <Col xs={6} className='d-flex flex-column justify-content-center'>
        <Button
          variant="dark"
          onClick={ () => { Controllers.Airline.buyPlane(plane) }}
          disabled={ Controllers.Hangar.getAssetsCount() >= Controllers.Airline.getTier().record.constraints.maxPlanes }
        >
          <span className='fw-bold'>Buy for {plane.getPricingFormatted().purchase}</span>
        </Button>
        <Button
          variant="info"
          className='mt-2'
          onClick={ () => { Controllers.Airline.leasePlane(plane) }}
          disabled={ Controllers.Hangar.getAssetsCount() >= Controllers.Airline.getTier().record.constraints.maxPlanes }
        >
          <span className='fw-bold'>Lease for {plane.getPricingFormatted().lease} / flight hour</span><br />
          <small>+ {plane.getPricingFormatted().leaseDownpayment} down payment<br />
          Duration: {plane.getLeaseDuration()}<br />
          Early cancelation fee: {plane.getPricingFormatted().leaseCancellationFee}</small>
        </Button>
      </Col>
    </Row>
  )
}

export default MarketListItem
