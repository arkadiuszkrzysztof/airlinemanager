import React from 'react'
import { Row, Col, Badge } from 'react-bootstrap'
import { type HangarAsset } from '../controllers/HangarController'
import { GameController } from '../controllers/GameController'
import { Clock, DaysOfWeek } from '../controllers/Clock'
import { type Schedule } from '../controllers/ScheduleController'
import { AirplaneFill, ArrowLeftRight, Reception0, Reception1, Reception2, Reception3, Reception4 } from 'react-bootstrap-icons'
import { formatCashValue } from '../controllers/helpers/Helpers'

interface Props {
  item: HangarAsset
}

const HangarListItem: React.FC<Props> = ({ item: asset }) => {
  const Controllers = GameController.getInstance()

  const flightStatus = (schedule: Schedule): { inTheAir: boolean, flightLeg: 'there' | 'back' } => {
    let inTheAir = false
    let flightLeg: 'there' | 'back' = 'there'

    const halftime = Clock.addToTime(schedule.start, Math.floor(schedule.option.turnaround / 2))

    if (
      (schedule.day === Controllers.Clock.currentDayOfWeek &&
        Clock.isCurrentTimeBetween(schedule.start, schedule.end)) ||
      (schedule.day === Controllers.Clock.previousDayOfWeek &&
        schedule.end < schedule.start &&
        Clock.isCurrentTimeBetween(schedule.start, schedule.end))
    ) {
      inTheAir = true

      if (Controllers.Clock.playtimeFormatted > halftime) {
        flightLeg = 'back'
      }
    }

    return { inTheAir, flightLeg }
  }

  const weeklyProfit = (): number => {
    const totalProfit = Controllers.Schedule
      .getActiveSchedulesForAsset(asset)
      .reduce((profit, schedule) => profit + schedule.option.revenue.total, 0)

    return totalProfit
  }

  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <Col xs={12}>
        <div className='d-flex align-items-center'>
          {`${asset.plane.familyName} ${asset.plane.typeName} [${asset.plane.registration}]`}
          <Badge bg={asset.ownership === 'owned' ? 'dark' : 'light'} className='mx-2'>
            {asset.ownership.toUpperCase()}
          </Badge>
          Total profit:
          <span className={`fw-bold mx-1 ${weeklyProfit() > 0 ? 'text-dark' : 'text-danger'}`}>
            {formatCashValue(weeklyProfit())}
          </span>
          per week
        </div>
      </Col>
      <Col xs={12}>
        <Row className='align-items-start pt-2'>
          {Object.values(DaysOfWeek).map((day) =>
            <Col key={day} xs={4} md={3} xxl={true} className={`d-flex flex-column justify-content-center rounded bg-${Controllers.Clock.currentDayOfWeek === day ? 'body' : 'grey-light'}`}>
              <p className='text-center fw-bold text-dark'>
                {Controllers.Schedule.getTotalUseTime(asset, day) >= '12:00'
                  ? <Reception4 size={12} className='me-2 text-secondary' />
                  : Controllers.Schedule.getTotalUseTime(asset, day) >= '8:00'
                    ? <Reception3 size={12} className='me-2 text-info' />
                    : Controllers.Schedule.getTotalUseTime(asset, day) >= '04:00'
                      ? <Reception2 size={12} className='me-2 text-info' />
                      : Controllers.Schedule.getTotalUseTime(asset, day) > '00:00'
                        ? <Reception1 size={12} className='me-2 text-danger' />
                        : <Reception0 size={12} className='me-2 text-danger' />}
                {day}
              </p>
              {Controllers.Schedule
                .getActiveSchedulesForAsset(asset)
                .filter((schedule) => schedule.day === day)
                .sort((a, b) => (a.start < b.start ? -1 : 1))
                .map((schedule) =>
                <Row key={Math.random()} className='text-center'>
                  <p>
                    {`${schedule.start} - ${schedule.end}`}<br />
                    {schedule.contract.hub.IATACode}
                    {flightStatus(schedule).inTheAir
                      ? flightStatus(schedule).flightLeg === 'there'
                        ? <AirplaneFill size={12} className='text-warning mx-2 rotate-90 pulse-animation'/>
                        : <AirplaneFill size={12} className='text-warning mx-2 rotate-270 pulse-animation'/>
                      : <ArrowLeftRight size={12} className='text-dark mx-2'/>}
                    {schedule.contract.destination.IATACode}
                  </p>
                </Row>
                )}
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  )
}

export default HangarListItem
