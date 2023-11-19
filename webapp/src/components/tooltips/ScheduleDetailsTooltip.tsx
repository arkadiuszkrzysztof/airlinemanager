import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { formatCashValue, formatUtilization } from '../../controllers/helpers/Helpers'
import { Clock } from '../../controllers/Clock'
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
        <Col xs={6} className='text-start'>Expires in</Col>
        <Col xs={6} className='text-end'>{Clock.getFormattedTimeUntil(schedule.contract.expirationTime)}</Col>
      </Row>
    </>
  )
}

export default ScheduleDetailsTooltip
