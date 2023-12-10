import React, { type ReactElement } from 'react'
import { type Schedule } from '../../controllers/ScheduleController'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import ScheduleDetailsTooltip from '../tooltips/ScheduleDetailsTooltip'
import { AirplaneFill, ArrowLeftRight, CaretDownFill, CaretUpFill } from 'react-bootstrap-icons'
import { Clock, type DaysOfWeek, Timeframes } from '../../controllers/helpers/Clock'
import { GameController } from '../../controllers/GameController'

interface Props {
  currentDayOfWeek?: DaysOfWeek
  schedule: Schedule
  tooltipPosition: 'top' | 'bottom'
}

const ScheduleCalendarItem: React.FC<Props> = ({ currentDayOfWeek, schedule, tooltipPosition }): ReactElement => {
  const Controllers = GameController.getInstance()

  const spillsToNextDay = (schedule: Schedule): boolean => {
    return schedule.day === (currentDayOfWeek ?? Controllers.Clock.currentDayOfWeek as DaysOfWeek) && (Timeframes.DAY - Clock.getTimeAt(schedule.start) % Timeframes.DAY + 60 < schedule.option.totalTime)
  }

  const spillsFromPreviousDay = (schedule: Schedule): boolean => {
    return schedule.day === Clock.getDayBefore(currentDayOfWeek ?? Controllers.Clock.currentDayOfWeek as DaysOfWeek) && schedule.end < schedule.start
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
    <OverlayTrigger
      placement={tooltipPosition}
      overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><ScheduleDetailsTooltip schedule={schedule} /></Tooltip>}
      key={schedule.contract.id}
    >
      <div
        className={`d-flex align-items-center justify-content-center bg-info bg-opacity-${schedule.contract.startTime <= Controllers.Clock.playtime ? '75' : '25'} hover-bg-info ${getRoundedClass(schedule)} cursor-help`}
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
  )
}

export default ScheduleCalendarItem
