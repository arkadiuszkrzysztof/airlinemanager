import React, { type ReactElement } from 'react'
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import { GameController, type Controllers } from '../../controllers/GameController'
import { CalendarX, ClockHistory, ExclamationTriangle } from 'react-bootstrap-icons'
import { Clock, Timeframes } from '../../controllers/helpers/Clock'
import { type HangarAsset } from '../../controllers/HangarController'
import { type Schedule } from '../../controllers/ScheduleController'
import { type EventLogRecords } from '../../controllers/AirlineController'
import ScheduleDetailsTooltip from '../tooltips/ScheduleDetailsTooltip'

interface Props {
  fullWidth?: boolean
}

interface Expirations {
  schedules: Schedule[]
  assets: HangarAsset[]
}

const getExpirations = (Controllers: Controllers): Expirations => {
  const result: Expirations = { schedules: [], assets: [] }

  result.schedules = Controllers.Schedule
    .getActiveSchedules()
    .filter((schedule) => schedule.contract.expirationTime < Controllers.Clock.playtime + Timeframes.MONTH)
    .sort((a, b) => a.contract.expirationTime - b.contract.expirationTime)

  return result
}

const getEvents = (Controllers: Controllers): EventLogRecords => {
  return Controllers.Airline
    .getEventLog()
    .filter((event) => event.playtime > Controllers.Clock.playtime - Timeframes.MONTH)
    .sort((a, b) => b.playtime - a.playtime)
}

const getUpcomingEventCountdown = (time: number): ReactElement => {
  const [days, hours] = Clock.getExpirationTime(time)

  return (
    <Col xs={3} className={`d-flex p-2 bg-${days > 7 ? 'info' : 'warning'} align-items-center rounded-start justify-content-center fw-bold`}>
      {days > 0 ? `${days} D` : `${hours} H`}
    </Col>
  )
}

const getPastEventCountdown = (time: number): ReactElement => {
  const [days, hours] = Clock.getExpirationTime(time)

  return (
    <Col xs={3} className={`d-flex p-2 bg-grey-${days > 7 ? 'medium' : 'dark'} align-items-center rounded-start justify-content-center fw-bold`}>
      {days > 0 ? `${days} D` : `${hours} H`}
    </Col>
  )
}

const NotificationsWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const Controllers = GameController.getInstance()

  const [expirations] = React.useState(getExpirations(Controllers))
  const [events] = React.useState(getEvents(Controllers))

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <ExclamationTriangle size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>Notifications</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2' style={{ height: '320px' }}>
          <Row className='mx-2 mb-2 position-relative'>
            <Col xs={6}>
              <div className="d-flex align-items-center justify-content-center fs-5 fw-bold text-primary py-1 mb-2 border-bottom">
                <CalendarX size={20} className='me-2' />
                Upcoming expirations
              </div>
              {expirations.schedules.length === 0 && <h4 className='text-center text-grey-dark mt-2'>No upcoming expirations</h4>}
              {expirations.schedules.map((schedule) => (
                <Row key={schedule.contract.id} className='mb-2 me-2'>
                  {getUpcomingEventCountdown(schedule.contract.expirationTime)}
                  <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><ScheduleDetailsTooltip schedule={schedule} /></Tooltip>}
                        key={schedule.contract.id}
                      >
                    <Col xs={9} className='p-2 cursor-help bg-grey-light rounded-end'>
                      Contract <strong>{schedule.contract.id}</strong>
                    </Col>
                  </OverlayTrigger>
                </Row>
              ))}
            </Col>
            <Col xs={6}>
              <div className="d-flex align-items-center justify-content-center fs-5 fw-bold text-primary py-1 mb-2 border-bottom">
                <ClockHistory size={20} className='me-2' />
                Event log
              </div>
              {events.length === 0 && <h4 className='text-center text-grey-dark mt-2'>No past events</h4>}
              {events.map((event, index) => (
                <Row key={`${event.playtime}-${index}`} className='mb-2'>
                  {getPastEventCountdown(event.playtime)}
                  <Col xs={9} className='bg-grey-light rounded-end'>
                    {event.message}
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default NotificationsWidget
