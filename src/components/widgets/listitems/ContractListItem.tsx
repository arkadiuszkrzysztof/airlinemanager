import React from 'react'
import { type Contract } from '../../../models/Contract'
import { Row, Col, OverlayTrigger, Tooltip, Badge, Card } from 'react-bootstrap'
import { GameController } from '../../../controllers/GameController'
import { type ContractOption } from '../../../controllers/ContractsController'
import { AirplaneFill, ArrowLeftRight, CalendarWeekFill, ExclamationSquareFill, PersonFill, PinMapFill, StarFill } from 'react-bootstrap-icons'
import { Clock, Timeframes } from '../../../controllers/helpers/Clock'
import { formatCashValue, formatTurnaround, formatUtilization } from '../../../controllers/helpers/Helpers'
import PlaneDetailsTooltip from '../../tooltips/PlaneDetailsTooltip'
import CostBreakdownTooltip from '../../tooltips/CostBreakdownTooltip'
import RevenueBreakdownTooltip from '../../tooltips/RevenueBreakdownTooltip'
import TurnaroundBreakdownTooltip from '../../tooltips/TurnaroundBreakdownTooltip'

interface Props {
  item: { contract: Contract, options: ContractOption[] }
}

const ContractListItem: React.FC<Props> = ({ item }) => {
  const Controllers = GameController.getInstance()
  const { contract, options } = item

  return (
    <Row className={`bg-${contract.accepted ? 'danger bg-opacity-10' : 'grey-light'} ${options.length === 0 ? 'opacity-50 grayscale' : ''} rounded mt-2 p-2`}>
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
          <span><strong>{`${Clock.getDayOfWeek(contract.departureTime)}s`}</strong>{' at '}<strong>{Clock.formatPlaytime(contract.departureTime)}</strong></span>
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
        <Card>
          <Row className='mx-2 my-2 justify-content-center'>
            <Col xs={4} className='text-center'>Available planes: <strong>{options.filter(c => c.available).length}</strong></Col>
            <Col xs={4} className='text-center'>Best option: {options.length > 0
              ? <span className={`fw-bold ${options[0].profit > 0 ? 'text-dark' : 'text-danger'}`}>
                  {formatCashValue(options[0].profit)}
                </span>
              : <i>None</i>}
            </Col>
          </Row>
            {options.length > 0 && <div className='px-2 pb-2'>
              <Row className='small text-end fw-bold text-primary'>
                <Col className='col-10p p-0'></Col>
                <Col className='col-15p text-start'>Plane</Col>
                <Col className='col-15p'>Cost</Col>
                <Col className='col-15p'>Revenue</Col>
                <Col className='col-15p'>Profit</Col>
                <Col className='col-15p p-0'>Utilization</Col>
                <Col className='col-15p p-0'>Turnaround</Col>
              </Row>
              {options.map((option: ContractOption) => (
                <Row key={option.asset.plane.registration} className={`small opacity-${option.available ? '100' : '50'} hover-bg-grey-light`}>
                  <Col className='col-10p p-0'>
                    {option.available &&
                      <span onClick={() => { Controllers.Schedule.acceptContract(contract, option) }} className='text-white px-1 fw-bold bg-primary rounded' role='button'>
                        Accept
                      </span>
                    }
                  </Col>
                  <Col className={`col-15p pe-0 ${option.available ? ' ps-0' : ''}`}>
                    <span className='d-flex flex-row align-items-center'>
                      <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><PlaneDetailsTooltip asset={option.asset} /></Tooltip>}
                      >
                        <span className='cursor-help'>
                          {option.asset.plane.typeName}
                          {option.asset.plane.hub !== undefined && <Badge bg={'grey-dark'} className='ms-2'>
                            {option.asset.plane.hub.IATACode}
                          </Badge>}
                        </span>
                      </OverlayTrigger>
                    </span>
                  </Col>
                  <Col className='col-15p text-end'>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><CostBreakdownTooltip costs={option.cost} /></Tooltip>}
                    >
                      <span className='cursor-help'>{formatCashValue(option.cost.total)}</span>
                    </OverlayTrigger>
                  </Col>
                  <Col className='col-15p text-end'>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><RevenueBreakdownTooltip revenues={option.revenue} /></Tooltip>}
                    >
                      <span className='cursor-help'>{formatCashValue(option.revenue.total)}</span>
                    </OverlayTrigger>
                  </Col>
                  <Col className='col-15p text-end'>
                    <span className={`fw-bold ${option.profit > 0 ? 'text-dark' : 'text-danger'}`}>
                      {formatCashValue(option.profit)}
                    </span>
                  </Col>
                  <Col xs={2} className='col-15p text-end'>{formatUtilization(option.utilization)}</Col>
                  <Col xs={2} className='col-15p text-end'>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><TurnaroundBreakdownTooltip option={option} /></Tooltip>}
                      >
                      <span className='cursor-help'>{formatTurnaround(option.totalTime)}</span>
                    </OverlayTrigger>
                  </Col>
                </Row>
              ))}
            </div>}

        </Card>

    </Row>
  )
}

export default ContractListItem
