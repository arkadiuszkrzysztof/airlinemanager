import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { formatCashValue, formatUtilization } from '../../controllers/helpers/Helpers'
import { Clock } from '../../controllers/helpers/Clock'
import { type Schedule } from '../../controllers/ScheduleController'

const ScheduleDetailsTooltip: React.FC<{ schedule: Schedule }> = ({ schedule }) => {
  return (
    <>
      <strong>Schedule details:</strong><br />
      <Row>
        <Col xs={6} className='text-start'>Departure time</Col>
        <Col xs={6} className='text-end'>{schedule.contract.departureTime}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Return time</Col>
        <Col xs={6} className='text-end'>{Clock.addToTime(schedule.contract.departureTime, schedule.option.flightTime + schedule.option.boardingTime)}</Col>
      </Row>
      <Row>
        <Col xs={6} className='text-start'>Plane in use</Col>
        <Col xs={6} className='text-end'>{`${schedule.start} - ${schedule.end}`}</Col>
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
        <Col xs={6} className='text-end'>{`${schedule.contract.distance} km`}</Col>
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
