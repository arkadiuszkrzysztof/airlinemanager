import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { type ContractOptionCosts } from '../../controllers/ContractsController'
import { formatCashValue } from '../../controllers/helpers/Helpers'

const CostBreakdownTooltip: React.FC<{ costs: ContractOptionCosts }> = ({ costs }) => {
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
    </>
  )
}

export default CostBreakdownTooltip
