import React, { type ReactElement } from 'react'
import { Col, Row } from 'react-bootstrap'
import { formatCashValue, formatUtilization } from '../../controllers/helpers/Helpers'
import { Clock, Timeframes } from '../../controllers/helpers/Clock'
import { type Schedule } from '../../controllers/ScheduleController'
import { GameController } from '../../controllers/GameController'
import { ExclamationTriangle } from 'react-bootstrap-icons'

const ScheduleDetailsTooltip: React.FC<{ schedule: Schedule }> = ({ schedule }) => {
  const durationInDays = Math.floor(((schedule.end < schedule.start ? schedule.end + Timeframes.WEEK : schedule.end) - schedule.start) / Timeframes.DAY)

  const getCountdown = (message: string, time: number): ReactElement => {
    const [days, hours] = Clock.getExpirationTime(time)

    return (
      <span className='text-danger'>
        <ExclamationTriangle size={12} className='text-danger mx-2 mb-1'/>
         {message}{' '}{days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : `${hours} ${hours === 1 ? 'hour' : 'hours'}`}
      </span>
    )
  }

  return (
    <>
      <strong>Schedule details:</strong><br />
      {schedule.contract.startTime > Clock.getInstance().playtime && getCountdown('The contract starts in', schedule.contract.startTime)}
      {schedule.contract.expirationTime < Clock.getInstance().playtime + Timeframes.MONTH && getCountdown('The contract expires in', schedule.contract.expirationTime)}
      <Row>
        <Col xs={6} className='text-start'>Departure time</Col>
        <Col xs={6} className='text-end'>{Clock.formatPlaytime(schedule.contract.departureTime)}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Return time</Col>
        <Col xs={6} className='text-end'>{Clock.formatPlaytime((schedule.contract.departureTime + schedule.option.flightTime + schedule.option.boardingTime) % Timeframes.DAY)}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Plane in use</Col>
        <Col xs={6} className='text-end'>{`${Clock.formatPlaytime(schedule.start)} - ${Clock.formatPlaytime(schedule.end)}${durationInDays > 0 ? ' +' + durationInDays + 'd' : ''}`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Hub</Col>
        <Col xs={6} className='text-end'>{`${schedule.contract.hub.location} (${schedule.contract.hub.countryCode})`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Destination</Col>
        <Col xs={6} className='text-end'>{`${schedule.contract.destination.location} (${schedule.contract.destination.countryCode})`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Distance</Col>
        <Col xs={6} className='text-end'>{GameController.formatDistance(schedule.contract.distance)}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Flight time</Col>
        <Col xs={6} className='text-end'>{Clock.getFormattedHourlyTime(schedule.option.flightTime)}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Profit</Col>
        <Col xs={6} className='text-end'>{formatCashValue(schedule.option.profit)}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Plane</Col>
        <Col xs={6} className='text-end'>{`${schedule.option.asset.plane.familyName} ${schedule.option.asset.plane.typeName}`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Registration</Col>
        <Col xs={6} className='text-end'>{`${schedule.option.asset.plane.registration}`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Utilization</Col>
        <Col xs={6} className='text-end'>{formatUtilization(schedule.option.utilization)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Reputation</Col>
        <Col xs={5} className='text-end'>{`+${schedule.contract.reputation.toFixed(2)}%`}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Expires in</Col>
        <Col xs={6} className='text-end'>{Clock.getFormattedTimeUntil(schedule.contract.expirationTime)}</Col>
      </Row>
    </>
  )
}

export default ScheduleDetailsTooltip
