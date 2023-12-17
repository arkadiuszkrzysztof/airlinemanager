import React, { useEffect, type ReactElement } from 'react'
import { Card, Col } from 'react-bootstrap'

import { GraphUpArrow } from 'react-bootstrap-icons'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { GameController } from '../../controllers/GameController'
import { type PNLRecord } from '../../controllers/AirlineController'
import { Timeframes } from '../../controllers/helpers/Clock'
import { formatScale } from '../../controllers/helpers/Helpers'

interface Props {
  fullWidth?: boolean
}

type PassengersChartData = Array<{ month: string, economy: number, business: number, first: number }>

const preparePassengersData = (data: Record<number, PNLRecord>, duration: number = 6): PassengersChartData => {
  const Controllers = GameController.getInstance()
  const result: PassengersChartData = []

  Object.entries(data)
    .sort(([a]: [string, PNLRecord], [b]: [string, PNLRecord]) => parseInt(a) - parseInt(b))
    .slice(-duration)
    .forEach(([monthPlaytime, record]: [string, PNLRecord]) => {
      result.push({
        month: (Controllers.Clock.playtime - parseInt(monthPlaytime) < Timeframes.MONTH ? 'Current Month' : `Previous -${Math.floor((Controllers.Clock.playtime - parseInt(monthPlaytime)) / Timeframes.MONTH)}`),
        economy: record.statistics.totalPassengers.economy,
        business: record.statistics.totalPassengers.business,
        first: record.statistics.totalPassengers.first
      })
    })

  return result
}

const getTotalPassengers = (data: Record<number, PNLRecord>): number => {
  let total = 0

  Object.values(data).forEach((record: PNLRecord) => {
    total += record.statistics.totalPassengers.economy + record.statistics.totalPassengers.business + record.statistics.totalPassengers.first
  })

  return total
}

const formatTooltipLabels = (value: any, name: any): [string, string] => {
  const Labels = { economy: 'Economy Class', business: 'Business Class', first: 'First Class' }

  return [value, Labels[name as keyof typeof Labels]]
}

const PassengersWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const [chartData, setChartData] = React.useState<PassengersChartData>([])
  const Controllers = GameController.getInstance()

  useEffect(() => {
    setChartData(preparePassengersData(Controllers.Airline.PNL))
  }, [])

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <GraphUpArrow size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>Passengers</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2' style={{ height: '400px' }}>
            <h4 className='text-center pt-2'>Total Passengers: <span className='text-primary fw-bold'>{`${formatScale(getTotalPassengers(Controllers.Airline.PNL), true)}`}</span></h4>
          <ResponsiveContainer width={'100%'} height={'100%'}>
            <AreaChart
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
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis tickFormatter={(value: any) => formatScale(value)}/>
              <Tooltip formatter={(value: any, name: any) => formatTooltipLabels(value, name)} />
              <Area type="monotone" dataKey="economy" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="business" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="first" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default PassengersWidget
