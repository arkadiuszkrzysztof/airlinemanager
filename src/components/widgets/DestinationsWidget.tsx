import React, { useEffect, type ReactElement } from 'react'
import { Card, Col } from 'react-bootstrap'

import { GraphUpArrow } from 'react-bootstrap-icons'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { type PNLRecord } from '../../controllers/AirlineController'
import { Regions } from '../../models/Airport'

interface Props {
  data: Record<number, PNLRecord>
  fullWidth?: boolean
}

type DestinationsChartData = Array<{ region: keyof typeof Regions, visits: number }>

const COLORS = ['#81D8D0', '#a583f5', '#e08e78', '#FFE5A1', '#008080', '#83C7FE']

const prepareDestinationsData = (data: Record<number, PNLRecord>, duration: number = 3): DestinationsChartData => {
  const temp = {
    NA: 0,
    EU: 0,
    ASIA: 0,
    LATAM: 0,
    AFRICA: 0,
    OCEANIA: 0
  }

  Object.entries(data)
    .sort(([a]: [string, PNLRecord], [b]: [string, PNLRecord]) => parseInt(a) - parseInt(b))
    .slice(-duration)
    .forEach(([monthPlaytime, record]: [string, PNLRecord]) => {
      temp.NA += record.statistics.visitedRegions.NA
      temp.EU += record.statistics.visitedRegions.EU
      temp.ASIA += record.statistics.visitedRegions.ASIA
      temp.LATAM += record.statistics.visitedRegions.LATAM
      temp.AFRICA += record.statistics.visitedRegions.AFRICA
      temp.OCEANIA += record.statistics.visitedRegions.OCEANIA
    })

  const result = []

  if (temp.NA > 0) result.push({ region: 'NA', visits: temp.NA })
  if (temp.EU > 0) result.push({ region: 'EU', visits: temp.EU })
  if (temp.ASIA > 0) result.push({ region: 'ASIA', visits: temp.ASIA })
  if (temp.LATAM > 0) result.push({ region: 'LATAM', visits: temp.LATAM })
  if (temp.AFRICA > 0) result.push({ region: 'AFRICA', visits: temp.AFRICA })
  if (temp.OCEANIA > 0) result.push({ region: 'OCEANIA', visits: temp.OCEANIA })

  return result as DestinationsChartData
}

const formatTooltipLabels = (entry: any): string => {
  return `${Regions[entry.region as keyof typeof Regions]}: ${entry.visits} ${entry.visits > 1 ? 'visits' : 'visit'}`
}

const DestinationsWidget: React.FC<Props> = ({ data, fullWidth = false }): ReactElement => {
  const [chartData, setChartData] = React.useState<DestinationsChartData>([])

  useEffect(() => {
    setChartData(prepareDestinationsData(data))
  }, [data])

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 widget-shadow' >
        <Card.Header className='position-sticky d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <GraphUpArrow size={24} className='text-dark mx-2' />
            <span className='text-dark fw-bold fs-5'>Destinations (last 3 months)</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2' style={{ height: '350px' }}>
          {chartData.length === 0 && <h4 className='text-center text-grey-dark mt-2'>No data available</h4>}
          {chartData.length !== 0 && <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={200}>
              <Pie isAnimationActive={false} data={chartData} nameKey="region" dataKey="visits" cx="50%" cy="50%" innerRadius={100} outerRadius={150} paddingAngle={5} fill="#82ca9d" label={formatTooltipLabels}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default DestinationsWidget
