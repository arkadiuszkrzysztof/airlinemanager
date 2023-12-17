import React, { useEffect, type ReactElement } from 'react'
import { Card, Col, Row } from 'react-bootstrap'

import TimetableHoursCol from '../fragments/TimetableHours'
import TimetableGrid from '../fragments/TimetableGrid'
import { type Schedule } from '../../controllers/ScheduleController'
import { GameController } from '../../controllers/GameController'
import { Timeframes } from '../../controllers/helpers/Clock'
import { CalendarWeek } from 'react-bootstrap-icons'
import ScheduleCalendarItem from '../fragments/ScheduleCalendarItem'
import { ContractsController } from '../../controllers/ContractsController'

interface Props {
  fullWidth?: boolean
}

const getSchedulesForToday = (): Schedule[][] => {
  const Controllers = GameController.getInstance()
  const schedulesToAssign = Controllers.Schedule.getTodaySchedules().sort((a, b) => (a.start < b.start ? -1 : 1))

  if (schedulesToAssign.length === 0) {
    return [[]]
  }

  const buckets: Schedule[][] = []

  schedulesToAssign.forEach(scheduleToAssign => {
    let assigned = false

    buckets.forEach((scheduleBucket) => {
      if (!assigned) {
        const available = ContractsController.getInstance().canAssignSchedule(scheduleBucket, scheduleToAssign)

        if (available) {
          scheduleBucket.push(scheduleToAssign)
          assigned = true
        }
      }
    })

    if (!assigned) {
      buckets.push([scheduleToAssign])
    }
  })

  return buckets
}

const FlightsPreviewWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const Controllers = GameController.getInstance()
  const [schedules, setSchedules] = React.useState<Schedule[][]>([])

  useEffect(() => {
    setSchedules(getSchedulesForToday())
  }, [])

  return (
    <Col xs={12} xxl={fullWidth ? 10 : 5} xxxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <CalendarWeek size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>{`${Controllers.Clock.currentDayOfWeek}'s Schedule`}</span>
          </div>
          <span className='text-primary fs-6'>{`Refresh in ${Controllers.Clock.timeToNextDay}`}</span>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-4 pb-2'>
          <Row className='mx-2 mb-2' style={{ height: '300px', minWidth: `${schedules.length * 150 + 150}px` }}>
            <TimetableHoursCol showLabels />
              {schedules.map((bucket, index) =>
                <Col key={`bucket-${index}`} style={{ position: 'relative', minWidth: '150px' }}>
                  <TimetableGrid />
                  <div className='position-absolute bg-warning opacity-25' style={{ top: `${Controllers.Clock.playtime % Timeframes.DAY / 6 + 15}px`, width: '100%', height: '10px', margin: '0 -12px' }}></div>
                  {bucket.map((schedule) =>
                    <ScheduleCalendarItem
                      key={schedule.contract.id}
                      schedule={schedule}
                      tooltipPosition='bottom' />
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
