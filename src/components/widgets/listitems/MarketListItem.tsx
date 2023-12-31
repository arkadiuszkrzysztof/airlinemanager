import React from 'react'
import { type Plane } from '../../../models/Plane'
import { Row, Col, Button } from 'react-bootstrap'
import { GameController } from '../../../controllers/GameController'
import { CalendarWeekFill, CashStack, PersonFill, PinMapFill, StarFill, TagFill } from 'react-bootstrap-icons'

interface Props {
  item: Plane
}

const MarketListItem: React.FC<Props> = ({ item: plane }) => {
  const Controllers = GameController.getInstance()

  const isHangarFull = (): boolean => {
    return Controllers.Hangar.getAssetsCount() >= Controllers.Airline.getTier().record.constraints.maxPlanes
  }

  const canBuy = (plane: Plane): boolean => {
    return !isHangarFull() && Controllers.Airline.cash >= plane.pricing.purchase
  }

  const canLease = (pleane: Plane): boolean => {
    return !isHangarFull() && Controllers.Airline.cash >= plane.pricing.leaseDownpayment
  }

  return (
    <Row className={`bg-light bg-opacity-75 item-shadow rounded my-2 mx-1 p-2 ${isHangarFull() ? 'opacity-50 grayscale' : ''}`}>
      <Col xs={6}>
        <div className='d-flex align-items-center'>
          <span className='fs-4 fw-bold text-primary'>{`${plane.familyName} ${plane.typeName}`}</span>
          <StarFill size={16} className='text-badge-gold mx-2' />
          <span className='fw-bold'>{` +${plane.reputation.toFixed(2)}%`}</span>
        </div>
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
          {GameController.formatDistance(plane.maxRange)}
        </div>
        <div className='d-flex align-items-center'>
          <CalendarWeekFill size={20} className='text-grey-dark me-2' />
          <span><strong>{plane.age}</strong> old</span>
        </div>
        <div className='d-flex align-items-center'>
          <CashStack size={20} className='text-grey-dark me-2' />
          <span>Maintenance: <strong>{plane.pricingFormatted.maintenance} / flight hour</strong></span>
        </div>
      </Col>
      <Col xs={6} className='d-flex flex-column justify-content-center'>
        <Button
          variant="success-light"
          className={`${!canBuy(plane) ? 'grayscale' : ''}`}
          onClick={ () => { Controllers.Airline.buyPlane(plane) }}
          disabled={ !canBuy(plane) }
        >
          <span className='fw-bold'>Buy for {plane.pricingFormatted.purchase}</span>
        </Button>
        <Button
          variant="info-light"
          className={`mt-2 ${!canLease(plane) ? 'grayscale' : ''}`}
          onClick={ () => { Controllers.Airline.leasePlane(plane) }}
          disabled={ !canLease(plane) }
        >
          <span className='fw-bold'>Lease for {plane.pricingFormatted.lease} / flight hour</span><br />
          <small>+ {plane.pricingFormatted.leaseDownpayment} down payment<br />
          Duration: {plane.leaseDuration}<br />
          Early cancelation fee: {plane.pricingFormatted.leaseCancellationFee}</small>
        </Button>
      </Col>
    </Row>
  )
}

export default MarketListItem
