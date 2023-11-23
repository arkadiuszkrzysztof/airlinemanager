import React, { type ReactElement } from 'react'
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import TimetableHoursCol from '../fragments/TimetableHours'
import TimetableGrid from '../fragments/TimetableGrid'
import { type Schedule } from '../../controllers/ScheduleController'
import { type Controllers } from '../../controllers/GameController'
import { Clock, Timeframes } from '../../controllers/helpers/Clock'
import { AirplaneFill, ArrowLeftRight, CalendarWeek } from 'react-bootstrap-icons'
import ScheduleDetailsTooltip from '../tooltips/ScheduleDetailsTooltip'
import { flightStatus } from '../../controllers/helpers/Helpers'

interface Props {
  Controllers: Controllers
  fullWidth?: boolean
}

const FlightsPreview: React.FC<Props> = ({ Controllers, fullWidth = false }): ReactElement => {
  const getSchedulesForToday = (): Schedule[][] => {
    const schedulesToAssign = Controllers.Schedule.getTodaySchedules().sort((a, b) => (a.start < b.start ? -1 : 1))

    if (schedulesToAssign.length === 0) {
      return [[]]
    }

    const result: Schedule[][] = []

    schedulesToAssign.forEach(scheduleToAssign => {
      let assigned = false

      result.forEach((scheduleBucket) => {
        if (!assigned) {
          let available = true

          scheduleBucket.forEach((schedule) => {
            if (Clock.isTimeBetween(scheduleToAssign.start, schedule.start, schedule.end) ||
              Clock.isTimeBetween(scheduleToAssign.end, schedule.start, schedule.end) ||
              Clock.isTimeBetween(schedule.start, scheduleToAssign.start, scheduleToAssign.end) ||
              Clock.isTimeBetween(schedule.end, scheduleToAssign.start, scheduleToAssign.end)) {
              available = false
            }
          })

          if (available) {
            scheduleBucket.push(scheduleToAssign)
            assigned = true
          }
        }
      })

      if (!assigned) {
        result.push([scheduleToAssign])
      }
    })

    return result
  }

  return (
    <Col xs={12} md={11} lg={9} xl={8} xxl={fullWidth ? 10 : 5} xxxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <CalendarWeek size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>{`${Controllers.Clock.currentDayOfWeek}'s Schedule`}</span>
          </div>
          <span className='text-primary fs-6'>{`Refresh in ${Controllers.Clock.timeToNextDay}`}</span>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2'>
          <Row className='mx-2 mb-2' style={{ height: '300px' }}>
            <TimetableHoursCol showLabels />
              {getSchedulesForToday().map((bucket, index) =>
                <Col key={`bucket-${index}`} style={{ position: 'relative' }}>
                  <TimetableGrid />
                  {bucket.map((schedule) =>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><ScheduleDetailsTooltip schedule={schedule} /></Tooltip>}
                        key={schedule.contract.id}
                      >
                        <div
                          className='d-flex align-items-center justify-content-center bg-info bg-opacity-75 hover-bg-info rounded cursor-help'
                          style={{
                            position: 'absolute',
                            top: `${Clock.getTimeAt(schedule.start) % Timeframes.DAY / 6 + 20}px`,
                            width: 'calc(100% - 24px)',
                            height: `${(schedule.option.totalTime) / 6}px`
                          }}
                        >
                          {schedule.contract.hub.IATACode}
                          {flightStatus(schedule).inTheAir
                            ? flightStatus(schedule).flightLeg === 'there'
                              ? <AirplaneFill size={12} className='text-warning mx-2 rotate-90 pulse-animation'/>
                              : <AirplaneFill size={12} className='text-warning mx-2 rotate-270 pulse-animation'/>
                            : <ArrowLeftRight size={12} className='text-dark mx-2'/>}
                          {schedule.contract.destination.IATACode}
                          <div className='text-primary ms-2'>{`${schedule.option.asset.plane.typeName} (${schedule.option.asset.plane.registration})`}</div>
                        </div>
                      </OverlayTrigger>
                  )}
                </Col>
              )}
              <TimetableHoursCol />
            </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default FlightsPreview
