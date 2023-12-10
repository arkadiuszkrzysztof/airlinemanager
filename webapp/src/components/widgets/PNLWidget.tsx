import React, { type ReactElement } from 'react'
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import { GameController, type Controllers } from '../../controllers/GameController'
import { GraphUpArrow } from 'react-bootstrap-icons'
import { type PNLRecord } from '../../controllers/AirlineController'
import { Timeframes } from '../../controllers/helpers/Clock'
import type { CostsBreakdown, RevenuesBreakdown } from '../../controllers/ContractsController'
import RevenueBreakdownTooltip from '../tooltips/RevenueBreakdownTooltip'
import CostBreakdownTooltip from '../tooltips/CostBreakdownTooltip'

interface Props {
  fullWidth?: boolean
}

interface PNLChartData {
  data: Array<{
    month: string
    costs: CostsBreakdown
    revenue: RevenuesBreakdown
  }>
  maxTotal: number
  scale: {
    step: number
    numberOfSteps: number
    max: number
  }
}

const preparePNLData = (Controllers: Controllers): PNLChartData => {
  const result: PNLChartData = {
    data: [],
    maxTotal: 0,
    scale: {
      step: 0,
      numberOfSteps: 0,
      max: 0
    }
  }

  Object.entries(Controllers.Airline.PNL)
    .sort(([a]: [string, PNLRecord], [b]: [string, PNLRecord]) => parseInt(a) - parseInt(b))
    .slice(-6)
    .forEach(([monthPlaytime, record]: [string, PNLRecord]) => {
      const totalcosts = record.costs.cancellationFee + record.costs.fuel + record.costs.maintenance + record.costs.downpayment + record.costs.landing + record.costs.leasing + record.costs.passenger + record.costs.purchasing
      const totalRevenue = record.revenue.business + record.revenue.economy + record.revenue.first + record.revenue.selling + (record.revenue.missions ?? 0)

      result.data.push({
        month: (Controllers.Clock.playtime - parseInt(monthPlaytime) < Timeframes.MONTH ? 'Current Month' : `Last -${Math.floor((Controllers.Clock.playtime - parseInt(monthPlaytime)) / Timeframes.MONTH)}`),
        costs: {
          ...record.costs,
          total: totalcosts
        },
        revenue: {
          ...record.revenue,
          total: totalRevenue
        }
      })
      result.maxTotal = Math.floor(Math.max(result.maxTotal, totalcosts, totalRevenue))
    })

  result.scale.step = Math.pow(10, result.maxTotal.toString().length - 1)
  const numberOfSteps = Math.ceil(result.maxTotal / result.scale.step)
  if (numberOfSteps < 3) {
    result.scale.step = result.scale.step / 2
  } else if (numberOfSteps > 6) {
    result.scale.step = result.scale.step * 2
  }

  result.scale.numberOfSteps = Math.ceil(result.maxTotal / result.scale.step)
  result.scale.max = result.scale.step * result.scale.numberOfSteps

  return result
}

const formatScale = (value: number, showDecimal: boolean = false): string => {
  if (value >= 1000000 && Math.floor(value / 1000000) < 10 && showDecimal) {
    return `${(Math.floor(value / 100000) / 10).toFixed(1)}M`
  } else if (value >= 1000000) {
    return `${Math.floor(value / 1000000)}M`
  } else if (value >= 1000 && Math.floor(value / 1000) < 10 && showDecimal) {
    return `${(Math.floor(value / 100) / 10).toFixed(1)}K`
  } else if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`
  } else {
    return `${Math.floor(value)}`
  }
}

const getScale = (pnlData: PNLChartData): ReactElement[] => {
  const content: ReactElement[] = []

  for (let i = 0; i <= pnlData.scale.numberOfSteps; i++) {
    content.push(
      <div key={`scale-${i}`} className='position-absolute start-0 border-top' style={{ bottom: `${(i * pnlData.scale.step) / pnlData.scale.max * 250 + 50}px` }}>
        {i > 0 && <span className='position-absolute small text-grey-dark fw-bold' style={{ marginLeft: '-50px', marginTop: '-12px' }}>{`$${formatScale(i * pnlData.scale.step)}`}</span>}
      </div>
    )
  }

  return content
}

const formatNetProfit = (value: string, profit: number): ReactElement => {
  if (profit > 0) {
    return (
      <span className='text-success'>
        <span className='me-1'>+</span>
        {value}
      </span>
    )
  } else if (profit < 0) {
    return (
      <span className='text-danger'>
        <span className='me-1'>-</span>
        {value}
      </span>
    )
  } else {
    return (
      <span className='text-grey-dark'>
        {value}
      </span>
    )
  }
}

const PNLWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const Controllers = GameController.getInstance()

  const [pnlData] = React.useState<PNLChartData>(preparePNLData(Controllers))

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <GraphUpArrow size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>Profit & Loss</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2'>
          <Row className='mx-2 mb-2 position-relative ms-5'>
            {getScale(pnlData)}
            {pnlData.data.map((record) => (
              <Col key={`${record.month}-graphs`} style={{ zIndex: 2 }}>
                <Row className='align-items-end gx-2' style={{ height: '275px' }}>
                  <OverlayTrigger placement="top" overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><CostBreakdownTooltip costs={record.costs} showTotal /></Tooltip>}>
                    <Col key={`${record.month}-costs`} className='d-flex flex-wrap align-items-stretch justify-content-end cursor-help'>
                      <div className='pnl-bar fw-bold small text-center'>{formatScale(record.costs.total, true)}</div>
                      {Object.keys(record.costs).filter((key) => key !== 'total').map((key, index) => {
                        const value = record.costs[key as keyof typeof record.costs]

                        if (value !== undefined && value !== 0) {
                          return (<div key={`${record.month}-${key}`} className={`pnl-bar bg-warning-scale-${8 - index}`} style={{ height: `${Math.round(value / pnlData.scale.max * 250)}px` }}></div>)
                        }

                        return null
                      })}
                    </Col>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><RevenueBreakdownTooltip revenues={record.revenue} showTotal /></Tooltip>}>
                    <Col key={`${record.month}-revenues`} className='d-flex flex-wrap align-items-stretch justify-content-end cursor-help'>
                    <div className='pnl-bar fw-bold small text-center'>{formatScale(record.revenue.total, true)}</div>
                      {Object.keys(record.revenue).filter((key) => key !== 'total').map((key, index) => {
                        const value = record.revenue[key as keyof typeof record.revenue]

                        if (value !== undefined && value !== 0) {
                          return (<div key={`${record.month}-${key}`} className={`pnl-bar bg-success-scale-${8 - index}`} style={{ height: `${Math.round(value / pnlData.scale.max * 250)}px` }}></div>)
                        }

                        return null
                      })}
                    </Col>
                  </OverlayTrigger>
                </Row>
                <Row className='justify-content-center small fw-bold' style={{ height: '50px' }}>
                  <Col className='d-flex flex-column'>
                      <Row>
                        <Col xs={12} className='m-0 p-0 text-center'>
                          {record.month}
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} className='m-0 p-0 text-center fs-5'>
                          {formatNetProfit(formatScale(Math.abs(record.revenue.total - record.costs.total), true), record.revenue.total - record.costs.total)}
                        </Col>
                      </Row>
                  </Col>
                </Row>
              </Col>
            )

            )}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default PNLWidget
