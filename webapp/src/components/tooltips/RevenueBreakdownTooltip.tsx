import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { type ContractOptionRevenues } from '../../controllers/ContractsController'
import { formatCashValue } from '../../controllers/helpers/Helpers'

const RevenueBreakdownTooltip: React.FC<{ revenues: ContractOptionRevenues }> = ({ revenues }) => {
  return (
    <>
      <strong>Revenues breakdown:</strong><br />
      <Row>
        <Col xs={7} className='text-start'>Economy Class</Col>
        <Col xs={5} className='text-end'>{formatCashValue(revenues.economy)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Business Class</Col>
        <Col xs={5} className='text-end'>{formatCashValue(revenues.business)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>First Class</Col>
        <Col xs={5} className='text-end'>{formatCashValue(revenues.first)}</Col>
      </Row>
    </>
  )
}

export default RevenueBreakdownTooltip
