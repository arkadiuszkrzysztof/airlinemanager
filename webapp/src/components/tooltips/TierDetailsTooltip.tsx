import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { formatPercentageValue } from '../../controllers/helpers/Helpers'
import { AirlineController } from '../../controllers/AirlineController'

const TierDetailsTooltip: React.FC = () => {
  const tier = AirlineController.getInstance().getTier()
  const nextTier = AirlineController.getInstance().getNextTier()

  return (
    <>
      <strong>Tier summary:</strong><br />
      <Row>
        <Col xs={6} className='text-start'></Col>
        <Col xs={3} className='text-end'>{tier.name}</Col>
        <Col xs={3} className='text-end'>{nextTier !== undefined ? nextTier.name : ''}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Maximum Take-Off Weight</Col>
        <Col xs={3} className='text-end'>{`${tier.record.constraints.MTOW} t`}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-primary fw-bold'>{`${nextTier.record.constraints.MTOW} t`}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Max planes in hangar</Col>
        <Col xs={3} className='text-end'>{tier.record.constraints.maxPlanes}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-primary fw-bold'>{nextTier.record.constraints.maxPlanes}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Reputation gain speed</Col>
        <Col xs={3} className='text-end'>{formatPercentageValue(tier.record.constraints.reputationGain)}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-danger fw-bold'>{formatPercentageValue(nextTier.record.constraints.reputationGain)}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Hub discount</Col>
        <Col xs={3} className='text-end'>{formatPercentageValue(tier.record.perks.hubDiscount)}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-primary fw-bold'>{formatPercentageValue(nextTier.record.perks.hubDiscount)}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Destination discount</Col>
        <Col xs={3} className='text-end'>{formatPercentageValue(tier.record.perks.destinationDiscount)}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-primary fw-bold'>{formatPercentageValue(nextTier.record.perks.destinationDiscount)}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Market discount</Col>
        <Col xs={3} className='text-end'>{formatPercentageValue(tier.record.perks.marketDiscount)}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-primary fw-bold'>{formatPercentageValue(nextTier.record.perks.marketDiscount)}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Max number of regions</Col>
        <Col xs={3} className='text-end'>{tier.record.constraints.maxNumberOfRegions}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-primary fw-bold'>{nextTier.record.constraints.maxNumberOfRegions}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Can fly cross-region?</Col>
        <Col xs={3} className='text-end'>{(tier.record.constraints.canFlyCrossRegion ? 'Yes' : 'No')}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-primary fw-bold'>{(nextTier.record.constraints.canFlyCrossRegion ? 'Yes' : 'No')}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Can order new planes?</Col>
        <Col xs={3} className='text-end'>{(tier.record.constraints.canOrderNewPlanes ? 'Yes' : 'No')}</Col>
        {nextTier !== undefined
          ? <Col xs={3} className='text-end text-primary fw-bold'>{(nextTier.record.constraints.canOrderNewPlanes ? 'Yes' : 'No')}</Col>
          : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
      </Row>
    </>
  )
}

export default TierDetailsTooltip
