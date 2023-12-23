import React, { type ReactElement } from 'react'
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import { CaretDownFill, CaretUpFill, HeartPulse, QuestionCircle } from 'react-bootstrap-icons'
import { GameController } from '../../controllers/GameController'
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts'
import { Timeframes } from '../../controllers/helpers/Clock'
import { formatCashValue, formatScale } from '../../controllers/helpers/Helpers'

interface Props {
  fullWidth?: boolean
}

const HealthcheckWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const Controllers = GameController.getInstance()

  const RADIAN = Math.PI / 180
  const utilizationChartBg = [
    { name: 'A', value: 50, color: '#FE8F66' },
    { name: 'B', value: 35, color: '#FFCC40' },
    { name: 'C', value: 15, color: '#71c78b' }
  ]
  const useTimeChartBg = [
    { name: 'A', value: 4, color: '#FE8F66' },
    { name: 'B', value: 8, color: '#FFCC40' },
    { name: 'C', value: 12, color: '#71c78b' }
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

  const planesAges = Controllers.Hangar.getPlanesAges()
  const getPlanesAgesData = (): Array<{ age: string, value: number, index: 1 }> => {
    const result = new Array<{ age: string, value: number, index: 1 }>(21)

    for (let i = 0; i < result.length; i++) {
      result[i] = { age: i.toString(), value: Math.min(planesAges.ages[i], 5), index: 1 }
    }

    return result
  }

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 widget-shadow' >
        <Card.Header className='position-sticky d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <HeartPulse size={24} className='text-dark mx-2' />
            <span className='text-dark fw-bold fs-5'>Healthcheck</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column overflow-auto pt-0 pb-2' style={{ height: '400px' }}>
          <Row className='my-2 justify-content-center'>
            <Col className='d-flex flex-column justify-content-center align-items-end' xs={'auto'}>
              <h4 className='text-center pt-0 mb-0'>Weekly Revenue: <span className='text-success fw-bold'>{formatCashValue(weeklyRevenue)}</span></h4>
              <h4 className='text-center pt-2'>Weekly Cost: <span className='text-danger fw-bold'>{formatCashValue(weeklyCost)}</span></h4>
            </Col>
            <Col className='d-flex flex-row justify-content-start align-items-center' xs={'auto'}>
              {weeklyRevenue > weeklyCost && <CaretUpFill size={40} className='text-success mb-1' />}
              {weeklyRevenue < weeklyCost && <CaretDownFill size={40} className='text-danger mb-1' />}
              <h2>{`${weeklyRevenue - weeklyCost < 0 ? '-' : ''}${formatScale(Math.abs(weeklyRevenue - weeklyCost), true)}`}</h2>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex flex-column justify-content-center align-items-center' xs={6} style={{ height: '170px' }}>
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
                    fill="#023838"
                    stroke="none"
                  >
                    {useTimeChartBg.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label value={'4 - 12 h'} position="insideStart" offset={38} fill="#005F73" />
                    <Label value={'> 12 hours'} position="insideStart" offset={107} fill="#005F73" />
                  </Pie>
                  {needle(useTimeIndex, useTimeChartBg, cx, cy, iR, oR, '#005F73')}
                </PieChart>
              <h5 className='text-center pt-1'>
                Average Daily Plane Use: <span className={`text-${useTimeIndex >= 12 ? 'success' : useTimeIndex >= 8 ? 'warning' : 'danger'} fw-bold`}>{`${useTimeIndex}h`}</span>
                <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: 'fixed' }}>On average, passenger jet airplanes are in use on long hauls for about 12 hours a day. The total number of 3000-3200 flight hours per year can be an industry benchmark for plane utilization.</Tooltip>}>
                  <QuestionCircle size={16} className='ms-2 mb-1 text-primary cursor-help' />
                </OverlayTrigger>
              </h5>
            </Col>
            <Col className='d-flex flex-column justify-content-center align-items-center' xs={6} style={{ height: '170px' }}>
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
                    fill="#023838"
                    stroke="none"
                  >
                    {utilizationChartBg.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label value={'0% - 50%'} position="insideStart" offset={18} fill="#005F73" />
                    <Label value={'50% - 85%'} position="insideStart" offset={93} fill="#005F73" />
                  </Pie>
                  {needle(utilizationIndex, utilizationChartBg, cx, cy, iR, oR, '#005F73')}
                </PieChart>
              <h5 className='text-center pt-1'>
                Average Seat Utilization: <span className={`text-${utilizationIndex >= 85 ? 'success' : utilizationIndex >= 50 ? 'warning' : 'danger'} fw-bold`}>{`${utilizationIndex}%`}</span>
                <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: 'fixed' }}>The top 10 international airlines have seat utilization of over 90%, and the top 50 - over 85%. Not many of the carriers operate with the seat utilization factor under 75%, and only a few - under 50%.</Tooltip>}>
                  <QuestionCircle size={16} className='ms-2 mb-1 text-primary cursor-help' />
                </OverlayTrigger>
              </h5>
            </Col>
          </Row>
          <Row className='mt-4 justify-content-center'>
            <ResponsiveContainer width="100%" height={60}>
              <ScatterChart
                width={600}
                height={60}
                margin={{
                  top: 10,
                  right: 40,
                  bottom: 0,
                  left: 40
                }}
              >
                <XAxis
                  type="category"
                  dataKey="age"
                  name="age"
                  interval={4}
                  tickLine={{ transform: 'translate(0, -6)' }}
                  tickFormatter={(value) => (value === '0' ? 'New' : value === '20' ? '20+ years' : `${value} years`)}
                />
                <YAxis
                  type="number"
                  dataKey="index"
                  height={0}
                  width={0}
                  tick={false}
                  tickLine={false}
                  axisLine={false}
                />
                <ZAxis type="number" dataKey="value" domain={[0, 5]} range={[0, 500]} />
                <Scatter isAnimationActive={false} data={getPlanesAgesData()}>
                  {getPlanesAgesData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={(index < 10 ? '#71c78b' : index < 15 ? '#FFCC40' : '#FE8F66')} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <h5 className='text-center pt-1'>
              Average Planes Age: <span className={`text-${planesAges.average < 10 ? 'success' : planesAges.average < 15 ? 'warning' : 'danger'} fw-bold`}>{`${planesAges.average.toFixed(1)} years`}</span>
              <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: 'fixed' }}>The average retirement age of passenger jet airplanes is about 20-25 years. Also, it is observed for the traditional full-cost carriers to have average fleet ages above ten years. For the low-cost carriers, however, the average plane age is usually under ten years.</Tooltip>}>
                <QuestionCircle size={16} className='ms-2 mb-1 text-primary cursor-help' />
              </OverlayTrigger>
            </h5>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default HealthcheckWidget
