import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Regions, type Airport } from '../../models/Airport'
import { formatCashValue } from '../../controllers/helpers/Helpers'
import { GameController } from '../../controllers/GameController'

const AirportDetailsTooltip: React.FC<{ airport: Airport }> = ({ airport }) => {
  const Controllers = GameController.getInstance()

  const tier = Controllers.Airline.getTier().record
  const isHub = Controllers.Hangar.getHubs().filter(hub => hub.IATACode === airport.IATACode).length > 0

  return (
    <>
      <strong>{`${airport.IATACode} (${airport.location})`}</strong>
      <Row>
        <Col xs={5} className='text-start'>Region</Col>
        <Col xs={7} className='text-end'>{Regions[airport.region]}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>IATA Code</Col>
        <Col xs={6} className='text-end'>{airport.IATACode}</Col>
      </Row>
      <Row>
        <Col xs={5} className='text-start'>Location</Col>
        <Col xs={7} className='text-end'>{airport.location}</Col>
      </Row>
      <Row>
        <Col xs={5} className='text-start'>Country</Col>
        <Col xs={7} className='text-end'>{`${airport.country} (${airport.countryCode})`}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Longest Runway</Col>
        <Col xs={5} className='text-end'>{airport.longestRunway} meters</Col>
      </Row>
      <Row className='mb-4'>
        <Col xs={7} className='text-start'>Passengers per year</Col>
        <Col xs={5} className='text-end'>{airport.passengers.toLocaleString('en-US', { maximumFractionDigits: 0 })}</Col>
      </Row>

      <strong>Airport Fees - {isHub ? <span className='fw-bold text-secondary'>Hub</span> : <span className='fw-bold text-primary'>Destination</span>}</strong>
      <Row>
        <Col xs={6} className='text-start'>Per passenger</Col>
        <Col xs={6} className='text-end'>
          {formatCashValue((isHub ? airport.fees.passenger * (1 - tier.perks.hubDiscount) : airport.fees.passenger * (1 - tier.perks.destinationDiscount)), true)}
          <span className='text-success'>{` (-${(isHub ? tier.perks.hubDiscount * 100 : tier.perks.destinationDiscount * 100).toFixed(0)}%)`}</span>
        </Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Per MTOW tone</Col>
        <Col xs={6} className='text-end'>
          {formatCashValue((isHub ? airport.fees.landing * (1 - tier.perks.hubDiscount) : airport.fees.landing * (1 - tier.perks.destinationDiscount)), true)}
          <span className='text-success'>{` (-${(isHub ? tier.perks.hubDiscount * 100 : tier.perks.destinationDiscount * 100).toFixed(0)}%)`}</span>
        </Col>
      </Row>
    </>
  )
}

export default AirportDetailsTooltip
