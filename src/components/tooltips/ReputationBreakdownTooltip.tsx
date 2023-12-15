import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { AirlineController } from '../../controllers/AirlineController'
import { Tier, Tiers } from '../../controllers/helpers/Tiers'

const ReputationBreakdownTooltip: React.FC = () => {
  const { fleet, connection, region, totalCapped } = AirlineController.getInstance().reputation

  return (
    <>
      <strong>Reputation breakdown:</strong>
      <Row>
        <Col xs={6} className='text-start'>From planes</Col>
        <Col xs={6} className='text-end'>{`+${fleet.toFixed(2)}%`}<small>{' / 40%'}</small></Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>From contracts</Col>
        <Col xs={6} className='text-end'>{`+${connection.toFixed(2)}%`}<small>{' / 40%'}</small></Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>From regions</Col>
        <Col xs={6} className='text-end'>{`+${region.toFixed(2)}%`}<small>{' / 20%'}</small></Col>
      </Row>
      <Row className='mb-4'>
        <Col xs={6} className='text-start fw-bold'>Total</Col>
        <Col xs={6} className='text-end fw-bold'>{`${totalCapped.toFixed(2)}%`}<small>{' / 100%'}</small></Col>
      </Row>

      <strong>Tiers minimum reputation:</strong>
      <Row>
        <Col xs={6} className='text-start'>{Tier.BRONZE}</Col>
        <Col xs={6} className='text-end'>{`${Tiers[Tier.BRONZE].minReputation}%`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>{Tier.SILVER}</Col>
        <Col xs={6} className='text-end'>{`${Tiers[Tier.SILVER].minReputation}%`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>{Tier.GOLD}</Col>
        <Col xs={6} className='text-end'>{`${Tiers[Tier.GOLD].minReputation}%`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>{Tier.PLATINUM}</Col>
        <Col xs={6} className='text-end'>{`${Tiers[Tier.PLATINUM].minReputation}%`}</Col>
      </Row>
    </>
  )
}

export default ReputationBreakdownTooltip
