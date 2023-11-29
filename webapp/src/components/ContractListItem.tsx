import React from 'react'
import { type Contract } from '../models/Contract'
import { Row, Col, OverlayTrigger, Tooltip, Accordion, Badge } from 'react-bootstrap'
import { GameController } from '../controllers/GameController'
import { type ContractOption } from '../controllers/ContractsController'
import { AirplaneFill, ArrowLeftRight, CalendarWeekFill, CheckSquare, ExclamationSquareFill, PersonFill, PinMapFill, StarFill } from 'react-bootstrap-icons'
import { Timeframes } from '../controllers/helpers/Clock'
import { formatCashValue, formatTurnaround, formatUtilization } from '../controllers/helpers/Helpers'
import PlaneDetailsTooltip from './tooltips/PlaneDetailsTooltip'
import CostBreakdownTooltip from './tooltips/CostBreakdownTooltip'
import RevenueBreakdownTooltip from './tooltips/RevenueBreakdownTooltip'

interface Props {
  item: Contract
}

const ContractListItem: React.FC<Props> = ({ item: contract }) => {
  const Controllers = GameController.getInstance()
  const contractOptions = Controllers.Contracts.getContractOptions(contract)

  return (
    <Row className={`bg-${contract.accepted ? 'danger bg-opacity-10' : 'grey-light'} rounded mt-2 p-2`}>
      {contract.accepted &&
        <Row className='mb-4'>
          <Col xs={12} className='d-flex align-items-center justify-content-center'>
            <ExclamationSquareFill size={20} className='text-danger me-2' />
            <span className='text-danger fw-bold'>Inactive contract - assign new plane!</span>
          </Col>
        </Row>
      }
      <Row>
        <Col className='flex-grow-0'>
          <Badge bg='dark fs-6'>{`${contract.hub.IATACode} (${contract.hub.location})`}</Badge>
        </Col>
        <Col className='flex-grow-0'>
          <ArrowLeftRight size={20} className='text-primary mx-0' />
        </Col>
        <Col className='flex-grow-0'>
          <Badge bg='light fs-6'>{`${contract.destination.IATACode} (${contract.destination.location})`}</Badge>
        </Col>
        <Col className='d-flex align-items-center'>
          <AirplaneFill size={20} className='text-grey-dark me-2 rotate-60' />
          <span><strong>{`${contract.dayOfWeek}s`}</strong>{' at '}<strong>{contract.departureTime}</strong></span>
          <StarFill size={16} className='text-badge-gold ms-4 me-2' />
          <span className='fw-bold'>{` +${contract.reputation.toFixed(2)}%`}</span>
        </Col>
      </Row>
      <Row>
        <Col className='d-flex my-2 align-items-center'>
          <PinMapFill size={20} className='text-grey-dark me-2' />
          <strong>{`${contract.distance} km`}</strong>
          <PersonFill size={20} className='text-grey-dark ms-4 me-2' />
          <strong>{contract.demand.economy + contract.demand.business + contract.demand.first}</strong>
          <span className='text-grey-dark small ms-2'>{`Economy: ${contract.demand.economy} ● Business: ${contract.demand.business} ● First: ${contract.demand.first}`}</span>
          <CalendarWeekFill size={20} className='text-grey-dark ms-4 me-2' />
          <strong>{`${contract.contractDuration / Timeframes.MONTH} months`}</strong>
        </Col>
      </Row>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header className='flex-row'>
              <Col xs={4}>Available planes: {contractOptions.filter(c => c.available).length}</Col>
              <Col xs={4}>Best option: {contractOptions.length > 0
                ? <span className={`fw-bold ${contractOptions[0].profit > 0 ? 'text-dark' : 'text-danger'}`}>
                    {formatCashValue(contractOptions[0].profit)}
                  </span>
                : <i>None</i>}</Col>
            </Accordion.Header>
          <Accordion.Body>
            <Row className='small text-end fw-bold text-primary'>
              <Col xs={2} className='text-start'>Plane</Col>
              <Col xs={2}>Cost</Col>
              <Col xs={2}>Revenue</Col>
              <Col xs={2}>Profit</Col>
              <Col xs={2}>Utilization</Col>
              <Col xs={2}>Turnaround</Col>
            </Row>
            {contractOptions.map((option: ContractOption) => (
              <Row key={option.asset.plane.registration} className={`small opacity-${option.available ? '100' : '50'} hover-bg-grey-light`}>
                <Col xs={2}>
                  <span className='d-flex flex-row align-items-center'>
                    {option.available &&
                      <span onClick={() => { Controllers.Schedule.acceptContract(contract, option) }} className='text-success me-1' role='button'>
                        <CheckSquare size={12} />
                      </span>
                    }
                  <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><PlaneDetailsTooltip asset={option.asset} /></Tooltip>}
                  >
                    <span className='cursor-help'>
                      {option.asset.plane.typeName}
                      <small className={`ps-1 fs-7 fw-bold text-${option.asset.ownership === 'owned' ? 'dark' : 'light'}`}>{option.asset.ownership.toUpperCase()}</small>
                    </span>
                  </OverlayTrigger>
                  </span>
                </Col>
                <Col xs={2} className='text-end'>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><CostBreakdownTooltip costs={option.cost} /></Tooltip>}
                  >
                    <span className='cursor-help'>{formatCashValue(option.cost.total)}</span>
                  </OverlayTrigger>
                </Col>
                <Col xs={2} className='text-end'>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><RevenueBreakdownTooltip revenues={option.revenue} /></Tooltip>}
                  >
                    <span className='cursor-help'>{formatCashValue(option.revenue.total)}</span>
                  </OverlayTrigger>
                </Col>
                <Col xs={2} className='text-end'>
                  <span className={`fw-bold ${option.profit > 0 ? 'text-dark' : 'text-danger'}`}>
                    {formatCashValue(option.profit)}
                  </span>
                </Col>
                <Col xs={2} className='text-end'>{formatUtilization(option.utilization)}</Col>
                <Col xs={2} className='text-end'>{formatTurnaround(option.totalTime)}</Col>
              </Row>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Row>
  )
}

export default ContractListItem
