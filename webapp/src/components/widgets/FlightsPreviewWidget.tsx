import React, { type ReactElement } from 'react'
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import TimetableHoursCol from '../fragments/TimetableHours'
import TimetableGrid from '../fragments/TimetableGrid'
import { type Schedule } from '../../controllers/ScheduleController'
import { GameController } from '../../controllers/GameController'
import { Clock, Timeframes } from '../../controllers/helpers/Clock'
import { AirplaneFill, ArrowLeftRight, CalendarWeek, CaretDownFill, CaretUpFill } from 'react-bootstrap-icons'
import ScheduleDetailsTooltip from '../tooltips/ScheduleDetailsTooltip'

interface Props {
  fullWidth?: boolean
}

const FlightsPreviewWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const Controllers = GameController.getInstance()

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

  const spillsToNextDay = (schedule: Schedule): boolean => {
    return schedule.day === Controllers.Clock.currentDayOfWeek && (Timeframes.DAY - Clock.getTimeAt(schedule.start) % Timeframes.DAY + 60 < schedule.option.totalTime)
  }

  const spillsFromPreviousDay = (schedule: Schedule): boolean => {
    return schedule.day === Controllers.Clock.previousDayOfWeek && schedule.end < schedule.start
  }

  const getRoundedClass = (schedule: Schedule): string => {
    if (spillsToNextDay(schedule)) {
      return 'rounded-top border-bottom border-warning border-2'
    } else if (spillsFromPreviousDay(schedule)) {
      return 'rounded-bottom border-top border-warning border-2'
    } else {
      return 'rounded'
    }
  }

  const getHeight = (schedule: Schedule): number => {
    if (spillsFromPreviousDay(schedule)) {
      return Clock.getTimeAt(schedule.end) - Controllers.Clock.timeThisDayStart + 60
    } else {
      return Math.min(schedule.option.totalTime, Timeframes.DAY - Clock.getTimeAt(schedule.start) % Timeframes.DAY + 60)
    }
  }

  return (
    <Col xs={12} xl={10} xxl={fullWidth ? 10 : 5} xxxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <CalendarWeek size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>{`${Controllers.Clock.currentDayOfWeek}'s Schedule`}</span>
          </div>
          <span className='text-primary fs-6'>{`Refresh in ${Controllers.Clock.timeToNextDay}`}</span>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-4 pb-2'>
          <Row className='mx-2 mb-2' style={{ height: '300px' }}>
            <TimetableHoursCol showLabels />
              {getSchedulesForToday().map((bucket, index) =>
                <Col key={`bucket-${index}`} style={{ position: 'relative' }}>
                  <TimetableGrid />
                  <div className='position-absolute bg-warning opacity-25' style={{ top: `${Controllers.Clock.playtime % Timeframes.DAY / 6 + 15}px`, width: '100%', height: '10px', margin: '0 -12px' }}></div>
                  {bucket.map((schedule) =>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><ScheduleDetailsTooltip schedule={schedule} /></Tooltip>}
                        key={schedule.contract.id}
                      >
                        <div
                          className={`d-flex align-items-center justify-content-center bg-info bg-opacity-75 hover-bg-info ${getRoundedClass(schedule)} cursor-help`}
                          style={{
                            position: 'absolute',
                            top: `${spillsFromPreviousDay(schedule) ? 10 : Clock.getTimeAt(schedule.start) % Timeframes.DAY / 6 + 20}px`,
                            width: 'calc(100% - 24px)',
                            height: `${getHeight(schedule) / 6}px`
                          }}
                        >
                          {schedule.contract.hub.IATACode}
                          {Clock.flightStatus(schedule).inTheAir
                            ? Clock.flightStatus(schedule).flightLeg === 'there'
                              ? <AirplaneFill size={12} className='text-warning mx-2 rotate-90 pulse-animation'/>
                              : <AirplaneFill size={12} className='text-warning mx-2 rotate-270 pulse-animation'/>
                            : <ArrowLeftRight size={12} className='text-dark mx-2'/>}
                          {schedule.contract.destination.IATACode}
                          {spillsToNextDay(schedule) && <CaretDownFill size={16} className='text-warning ms-2'/>}
                          {spillsFromPreviousDay(schedule) && <CaretUpFill size={16} className='text-warning ms-2'/>}
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

export default FlightsPreviewWidget
