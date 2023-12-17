import React, { type ReactElement } from 'react'
import { Card, Col, Row } from 'react-bootstrap'

import { CaretDownFill, CaretUpFill, HeartPulse } from 'react-bootstrap-icons'
import { GameController } from '../../controllers/GameController'
import { Cell, Pie, PieChart } from 'recharts'
import { Timeframes } from '../../controllers/helpers/Clock'
import { formatCashValue, formatScale } from '../../controllers/helpers/Helpers'

interface Props {
  fullWidth?: boolean
}

const HealthcheckWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const Controllers = GameController.getInstance()

  const RADIAN = Math.PI / 180
  const utilizationChartBg = [
    { name: 'A', value: 50, color: '#AE2012' },
    { name: 'B', value: 35, color: '#E9D8A6' },
    { name: 'C', value: 15, color: '#94D2BD' }
  ]
  const useTimeChartBg = [
    { name: 'A', value: 4, color: '#AE2012' },
    { name: 'B', value: 8, color: '#E9D8A6' },
    { name: 'C', value: 12, color: '#94D2BD' }
  ]
  const cx = 100
  const cy = 100
  const iR = 50
  const oR = 100

  const needle = (value: any, data: any, cx: any, cy: any, iR: any, oR: any, color: any): ReactElement[] => {
    let total = 0
    data.forEach((v: any) => {
      total += v.value
    })
    const ang = 180.0 * (1 - value / total)
    const length = (iR + 2 * oR) / 3
    const sin = Math.sin(-RADIAN * ang)
    const cos = Math.cos(-RADIAN * ang)
    const r = 5
    const x0 = cx + 5
    const y0 = cy + 5
    const xba = x0 + r * sin
    const yba = y0 - r * cos
    const xbb = x0 - r * sin
    const ybb = y0 + r * cos
    const xp = x0 + length * cos
    const yp = y0 + length * sin

    return [
      <circle key={'circle'} cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path key={'path'} d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />
    ]
  }

  const useTimeIndex = Math.floor(Controllers.Schedule.getWeeklyAverageUseTime() / Timeframes.WEEK * 24)
  const utilizationIndex = Math.floor(Controllers.Schedule.getWeeklyAverageUtilization())
  const weeklyRevenue = Controllers.Schedule.getWeeklyRevenue()
  const weeklyCost = Controllers.Schedule.getWeeklyCost()

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <HeartPulse size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>Healthcheck</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2' style={{ height: '320px' }}>
          <Row className='bg-grey-light rounded my-2 justify-content-center'>
            <Col className='d-flex flex-column justify-content-center align-items-end' xs={'auto'}>
              <h4 className='text-center pt-2 mb-0'>Weekly Revenue: <span className='text-primary fw-bold'>{formatCashValue(weeklyRevenue)}</span></h4>
              <h4 className='text-center pt-2'>Weekly Cost: <span className='text-danger fw-bold'>{formatCashValue(weeklyCost)}</span></h4>
            </Col>
            <Col className='d-flex flex-row justify-content-start align-items-center' xs={'auto'}>
              {weeklyRevenue > weeklyCost && <CaretUpFill size={40} className='text-success' />}
              {weeklyRevenue < weeklyCost && <CaretDownFill size={40} className='text-danger' />}
              <h2>{`${weeklyRevenue - weeklyCost < 0 ? '-' : ''}${formatScale(Math.abs(weeklyRevenue - weeklyCost), true)}`}</h2>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex flex-column justify-content-center align-items-center' xs={6} style={{ height: '200px' }}>
                <PieChart width={210} height={120}>
                  <Pie
                    isAnimationActive={false}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={useTimeChartBg}
                    cx={cx}
                    cy={cy}
                    innerRadius={iR}
                    outerRadius={oR}
                    fill="#8884d8"
                    stroke="none"
                  >
                    {useTimeChartBg.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {needle(useTimeIndex, useTimeChartBg, cx, cy, iR, oR, '#005F73')}
                </PieChart>
              <h4 className='text-center pt-2'>Average Daily Plane Use: <span className='text-primary fw-bold'>{`${useTimeIndex}h`}</span></h4>
            </Col>
            <Col className='d-flex flex-column justify-content-center align-items-center' xs={6} style={{ height: '200px' }}>
                <PieChart width={210} height={120}>
                  <Pie
                    isAnimationActive={false}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={utilizationChartBg}
                    cx={cx}
                    cy={cy}
                    innerRadius={iR}
                    outerRadius={oR}
                    fill="#8884d8"
                    stroke="none"
                  >
                    {utilizationChartBg.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {needle(utilizationIndex, utilizationChartBg, cx, cy, iR, oR, '#005F73')}
                </PieChart>
              <h4 className='text-center pt-2'>Average Seat Utilization: <span className='text-primary fw-bold'>{`${utilizationIndex}%`}</span></h4>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default HealthcheckWidget
