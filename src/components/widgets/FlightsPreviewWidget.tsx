import React, { useEffect, type ReactElement, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'

import TimetableHoursCol from '../fragments/TimetableHours'
import TimetableGrid from '../fragments/TimetableGrid'
import { type Schedule } from '../../controllers/ScheduleController'
import { GameController } from '../../controllers/GameController'
import { Timeframes } from '../../controllers/helpers/Clock'
import { CalendarWeek } from 'react-bootstrap-icons'
import ScheduleCalendarItem from '../fragments/ScheduleCalendarItem'
import { ContractsController } from '../../controllers/ContractsController'
import RefreshHint from '../fragments/RefreshHint'

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
  const [schedules, setSchedules] = useState<Schedule[][]>([])

  useEffect(() => {
    setSchedules(getSchedulesForToday())
  }, [])

  Controllers.Clock.registerListener('dailyScheduleUpdate', (playtime: number) => { if (playtime % Timeframes.DAY === 0) setSchedules(getSchedulesForToday()) })

  return (
    <Col xs={12} xxl={fullWidth ? 10 : 5} xxxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 mb-4 widget-shadow' >
        <Card.Header className='position-sticky d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <CalendarWeek size={24} className='text-dark mx-2' />
            <span className='text-dark fw-bold fs-5'>{`${Controllers.Clock.currentDayOfWeek}'s Schedule`}</span>
          </div>
          <span className='text-primary fs-6'>
            <RefreshHint timeTo={Controllers.Clock.timeToNextDayFormatted} realTimeTo={Controllers.Clock.timeToNextDayInRealTime} />
          </span>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 pt-2 pb-2 px-0 mx-4'>
          <Row>
            <Col style={{ maxWidth: '70px' }}>
              <TimetableHoursCol />
            </Col>
            <Col style={{ maxWidth: 'calc(100% - 70px)' }} className='overflow-auto'>
              <Row style={{ height: '280px', minWidth: `${schedules.length * 150 + 100}px` }}>
                {schedules.map((bucket, index) =>
                  <Col key={`bucket-${index}`} style={{ position: 'relative', minWidth: '150px' }}>
                    <TimetableGrid />
                    <div className='position-absolute bg-danger opacity-25' style={{ top: `${Controllers.Clock.playtime % Timeframes.DAY / 6 + 15}px`, width: '100%', height: '10px', margin: '0 -12px' }}></div>
                    {bucket.map((schedule) =>
                      <ScheduleCalendarItem
                        key={schedule.contract.id}
                        schedule={schedule}
                        tooltipPosition='bottom' />
                    )}
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default FlightsPreviewWidget
