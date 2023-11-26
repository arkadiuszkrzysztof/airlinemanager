import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { type CostsBreakdown } from '../../controllers/ContractsController'
import { formatCashValue } from '../../controllers/helpers/Helpers'

const CostBreakdownTooltip: React.FC<{ costs: CostsBreakdown, showTotal?: boolean }> = ({ costs, showTotal = false }) => {
  return (
    <>
      <strong>Costs breakdown:</strong><br />
      <Row>
        <Col xs={7} className='text-start'>Fuel</Col>
        <Col xs={5} className='text-end'>{formatCashValue(costs.fuel)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Maintenance</Col>
        <Col xs={5} className='text-end'>{formatCashValue(costs.maintenance)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Leasing</Col>
        <Col xs={5} className='text-end'>{formatCashValue(costs.leasing)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Landing fee</Col>
        <Col xs={5} className='text-end'>{formatCashValue(costs.landing)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Passenger fee</Col>
        <Col xs={5} className='text-end'>{formatCashValue(costs.passenger)}</Col>
      </Row>
      {showTotal && <Row>
        <Col xs={7} className='text-start'>Lease cancellation</Col>
        <Col xs={5} className='text-end'>{costs.cancellationFee !== undefined && formatCashValue(costs.cancellationFee)}</Col>
      </Row>}
      {showTotal && <Row>
        <Col xs={7} className='text-start'>Lease downpayment</Col>
        <Col xs={5} className='text-end'>{costs.downpayment !== undefined && formatCashValue(costs.downpayment)}</Col>
      </Row>}
      {showTotal && <Row>
        <Col xs={7} className='text-start'>Purchasing planes</Col>
        <Col xs={5} className='text-end'>{costs.purchasing !== undefined && formatCashValue(costs.purchasing)}</Col>
      </Row>}
      {showTotal && <Row className='fw-bold'>
        <Col xs={7} className='text-start'>Total</Col>
        <Col xs={5} className='text-end'>{formatCashValue(costs.total)}</Col>
      </Row>}
    </>
  )
}

export default CostBreakdownTooltip
