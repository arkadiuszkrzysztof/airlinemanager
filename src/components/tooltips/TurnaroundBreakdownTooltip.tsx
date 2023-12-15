import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { type ContractOption } from '../../controllers/ContractsController'
import { formatTurnaround } from '../../controllers/helpers/Helpers'

const TurnaroundBreakdownTooltip: React.FC<{ option: ContractOption }> = ({ option }) => {
  return (
    <>
      <strong>Turnaround breakdown:</strong><br />
      <Row>
        <Col xs={7} className='text-start pe-0'>Boarding Time</Col>
        <Col xs={5} className='text-end'>{formatTurnaround(option.boardingTime)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start pe-0'>Flight Time</Col>
        <Col xs={5} className='text-end'>{formatTurnaround(option.flightTime)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start pe-0'>Total One-way</Col>
        <Col xs={5} className='text-end'>{formatTurnaround(option.boardingTime + option.flightTime)}</Col>
      </Row>
      <Row className='fw-bold'>
        <Col xs={7} className='text-start pe-0'>Total</Col>
        <Col xs={5} className='text-end'>{formatTurnaround(option.totalTime)}</Col>
      </Row>
    </>
  )
}

export default TurnaroundBreakdownTooltip
