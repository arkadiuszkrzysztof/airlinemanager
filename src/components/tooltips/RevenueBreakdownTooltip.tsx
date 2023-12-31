import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { type RevenuesBreakdown } from '../../controllers/ContractsController'
import { formatCashValue } from '../../controllers/helpers/Helpers'

const RevenueBreakdownTooltip: React.FC<{ revenues: RevenuesBreakdown, showTotal?: boolean }> = ({ revenues, showTotal = false }) => {
  return (
    <>
      <strong>Revenues breakdown:</strong><br />
      <Row>
        <Col xs={7} className='text-start pe-0'>Economy Class</Col>
        <Col xs={5} className='text-end'>{formatCashValue(revenues.economy)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start pe-0'>Business Class</Col>
        <Col xs={5} className='text-end'>{formatCashValue(revenues.business)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start pe-0'>First Class</Col>
        <Col xs={5} className='text-end'>{formatCashValue(revenues.first)}</Col>
      </Row>
      {showTotal && <Row>
        <Col xs={7} className='text-start pe-0'>Selling planes</Col>
        <Col xs={5} className='text-end'>{revenues.selling !== undefined && formatCashValue(revenues.selling)}</Col>
      </Row>}
      {showTotal && <Row>
        <Col xs={7} className='text-start pe-0'>Missions</Col>
        <Col xs={5} className='text-end'>{revenues.missions !== undefined && formatCashValue(revenues.missions)}</Col>
      </Row>}
      {showTotal && <Row className='fw-bold'>
        <Col xs={7} className='text-start pe-0'>Total</Col>
        <Col xs={5} className='text-end'>{formatCashValue(revenues.total)}</Col>
      </Row>}
    </>
  )
}

export default RevenueBreakdownTooltip
