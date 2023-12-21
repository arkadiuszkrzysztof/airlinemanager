import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Regions, type Airport } from '../../models/Airport'

const AirportDetailsTooltip: React.FC<{ airport: Airport }> = ({ airport }) => {
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
      <Row>
        <Col xs={7} className='text-start'>Passengers per year</Col>
        <Col xs={5} className='text-end'>{airport.passengers.toLocaleString('en-US', { maximumFractionDigits: 0 })}</Col>
      </Row>
    </>
  )
}

export default AirportDetailsTooltip
