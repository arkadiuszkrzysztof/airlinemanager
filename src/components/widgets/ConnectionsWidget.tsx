import React, { useEffect, type ReactElement } from 'react'
import { Card, Col } from 'react-bootstrap'

import { GraphUpArrow } from 'react-bootstrap-icons'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { GameController } from '../../controllers/GameController'
import { type PNLRecord } from '../../controllers/AirlineController'
import { Timeframes } from '../../controllers/helpers/Clock'
import { formatScale } from '../../controllers/helpers/Helpers'

interface Props {
  data: Record<number, PNLRecord>
  fullWidth?: boolean
}

type ConnectionsChartData = Array<{ month: string, flights: number, distance: number }>

const prepareConnectionsData = (data: Record<number, PNLRecord>, duration: number = 6): ConnectionsChartData => {
  const Controllers = GameController.getInstance()
  const result: ConnectionsChartData = []
  const units = GameController.getUnits()

  Object.entries(data)
    .sort(([a]: [string, PNLRecord], [b]: [string, PNLRecord]) => parseInt(a) - parseInt(b))
    .slice(-duration)
    .forEach(([monthPlaytime, record]: [string, PNLRecord]) => {
      result.push({
        month: (Controllers.Clock.playtime - parseInt(monthPlaytime) < Timeframes.MONTH ? 'Current Month' : `Previous -${Math.floor((Controllers.Clock.playtime - parseInt(monthPlaytime)) / Timeframes.MONTH)}`),
        flights: record.statistics.numberOfFlights * 2,
        distance: record.statistics.totalDistance * units.distance.conversion
      })
    })

  return result
}

const formatTooltipLabels = (value: any, name: any): [string, string] => {
  const units = GameController.getUnits()
  const Labels = { flights: 'Flights', distance: `Distance (${units.distance.units})` }

  if (value === undefined) {
    return ['', Labels[name as keyof typeof Labels]]
  }

  return [formatScale(value, true), Labels[name as keyof typeof Labels]]
}

const ConnectionsWidget: React.FC<Props> = ({ data, fullWidth = false }): ReactElement => {
  const [chartData, setChartData] = React.useState<ConnectionsChartData>([])
  const units = GameController.getUnits()

  useEffect(() => {
    setChartData(prepareConnectionsData(data))
  }, [data])

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 widget-shadow' >
        <Card.Header className='position-sticky d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <GraphUpArrow size={24} className='text-dark mx-2' />
            <span className='text-dark fw-bold fs-5'>Flights & Distance</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2' style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={200}
            data={chartData}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" tickFormatter={(value: any) => formatScale(value, true)} label={{ value: 'Flights', style: { textAnchor: 'middle' }, angle: -90, position: 'left', offset: 0 }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value: any) => formatScale(value, true)} label={{ value: `Distance (${units.distance.units})`, style: { textAnchor: 'middle' }, angle: -90, position: 'right', offset: 0 }} />
            <Tooltip formatter={(value: any, name: any) => formatTooltipLabels(value, name)} />
            <Legend formatter={(value: any, name: any) => formatTooltipLabels(undefined, value)} />
            <Line isAnimationActive={false} yAxisId="left" type="monotone" dataKey="flights" stroke="#a583f5" activeDot={{ r: 8 }} />
            <Line isAnimationActive={false} yAxisId="right" type="monotone" dataKey="distance" stroke="#81D8D0" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ConnectionsWidget
