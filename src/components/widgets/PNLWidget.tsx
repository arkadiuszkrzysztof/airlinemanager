import React, { useEffect, type ReactElement } from 'react'
import { Card, Col } from 'react-bootstrap'

import { GameController } from '../../controllers/GameController'
import { GraphUpArrow } from 'react-bootstrap-icons'
import { type PNLRecord } from '../../controllers/AirlineController'
import { Timeframes } from '../../controllers/helpers/Clock'
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatScale } from '../../controllers/helpers/Helpers'

interface Props {
  data: Record<number, PNLRecord>
  fullWidth?: boolean
}

type PNLChartData = Array<{
  month: string
  operationsCosts: number
  marketCosts: number
  missionsCosts: number
  totalCosts: number
  ticketsRevenue: number
  marketRevenue: number
  missionsRevenue: number
  totalRevenue: number
}>

const preparePNLData = (data: Record<number, PNLRecord>, duration: number = 6): PNLChartData => {
  const Controllers = GameController.getInstance()
  const result: PNLChartData = []

  Object.entries(data)
    .sort(([a]: [string, PNLRecord], [b]: [string, PNLRecord]) => parseInt(a) - parseInt(b))
    .slice(-duration)
    .forEach(([monthPlaytime, record]: [string, PNLRecord]) => {
      const operationsCosts = record.costs.fuel + record.costs.maintenance + record.costs.landing + record.costs.passenger
      const marketCosts = record.costs.cancellationFee + record.costs.downpayment + record.costs.leasing + record.costs.purchasing
      const missionsCosts = record.costs.unlockingRegions
      const ticketsRevenue = record.revenue.business + record.revenue.economy + record.revenue.first
      const marketRevenue = record.revenue.selling
      const missionsRevenue = record.revenue.missions

      result.push({
        month: (Controllers.Clock.playtime - parseInt(monthPlaytime) < Timeframes.MONTH ? 'Current Month' : `Previous -${Math.floor((Controllers.Clock.playtime - parseInt(monthPlaytime)) / Timeframes.MONTH)}`),
        operationsCosts,
        marketCosts,
        missionsCosts,
        totalCosts: operationsCosts + marketCosts + missionsCosts,
        ticketsRevenue,
        marketRevenue,
        missionsRevenue,
        totalRevenue: ticketsRevenue + marketRevenue + missionsRevenue
      })
    })

  return result
}

const getTotalRevenue = (data: Record<number, PNLRecord>): number => {
  let total = 0

  Object.entries(data).forEach(([_, record]: [string, PNLRecord]) => {
    total += record.revenue.business + record.revenue.economy + record.revenue.first + record.revenue.selling + record.revenue.missions
  })

  return total
}

const formatTooltipLabels = (value: any, name: any): [string, string] => {
  const Labels = { operationsCosts: 'Operations Costs', marketCosts: 'Market Costs', missionsCosts: 'Missions Costs', ticketsRevenue: 'Tickets Revenue', marketRevenue: 'Market Revenue', missionsRevenue: 'Missions Revenue' }

  return [formatScale(value, true), Labels[name as keyof typeof Labels]]
}

const PNLWidget: React.FC<Props> = ({ data, fullWidth = false }): ReactElement => {
  const [chartData, setChartData] = React.useState<PNLChartData>([])

  useEffect(() => {
    setChartData(preparePNLData(data))
  }, [data])

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 widget-shadow' >
        <Card.Header className='position-sticky d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <GraphUpArrow size={24} className='text-dark mx-2' />
            <span className='text-dark fw-bold fs-5'>Profit & Loss</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2' style={{ height: '400px' }}>
            <h4 className='text-center pt-2'>Total Revenue: <span className='text-success fw-bold'>{`${formatScale(getTotalRevenue(data), true)}`}</span></h4>
            <ResponsiveContainer width={'100%'} height={'100%'}>
              <BarChart
                width={500}
                height={200}
                data={chartData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 0
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value: any, _: number) => formatScale(value)}/>
                <Tooltip formatter={(value: any, name: any) => formatTooltipLabels(value, name)} />
                <Bar isAnimationActive={false} dataKey="operationsCosts" stackId="a" fill="#FE8F66" />
                <Bar isAnimationActive={false} dataKey="marketCosts" stackId="a" fill="#f79f7e" />
                <Bar isAnimationActive={false} dataKey="missionsCosts" stackId="a" fill="#fab197"><LabelList dataKey="totalCosts" position="top" formatter={(value: any) => formatScale(value, true)} /></Bar>
                <Bar isAnimationActive={false} dataKey="ticketsRevenue" stackId="b" fill="#71c78b" />
                <Bar isAnimationActive={false} dataKey="marketRevenue" stackId="b" fill="#81ca97" />
                <Bar isAnimationActive={false} dataKey="missionsRevenue" stackId="b" fill="#9ee0b2"><LabelList dataKey="totalRevenue" position="top" formatter={(value: any) => formatScale(value, true)} /></Bar>
              </BarChart>
            </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default PNLWidget
