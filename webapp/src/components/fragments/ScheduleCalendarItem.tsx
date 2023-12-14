import React, { type ReactElement } from 'react'
import { type Schedule } from '../../controllers/ScheduleController'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import ScheduleDetailsTooltip from '../tooltips/ScheduleDetailsTooltip'
import { AirplaneFill, ArrowLeftRight, CaretDownFill, CaretUpFill } from 'react-bootstrap-icons'
import { Clock, Timeframes } from '../../controllers/helpers/Clock'
import { GameController } from '../../controllers/GameController'

interface Props {
  currentDayOfWeek?: string
  schedule: Schedule
  tooltipPosition: 'top' | 'bottom'
}

const ScheduleCalendarItem: React.FC<Props> = ({ currentDayOfWeek, schedule, tooltipPosition }): ReactElement => {
  const Controllers = GameController.getInstance()

  const startPlaytime = currentDayOfWeek !== undefined ? Controllers.Clock.getPlaytimeForDay(currentDayOfWeek) : Controllers.Clock.todayStartPlaytime % Timeframes.WEEK
  const endPlaytime = currentDayOfWeek !== undefined ? Controllers.Clock.getPlaytimeForDay(currentDayOfWeek) + Timeframes.DAY : Controllers.Clock.tomorrowStartPlaytime % Timeframes.WEEK

  // this.activeSchedules.filter(schedule =>
  //   (schedule.start >= startPlaytime && schedule.start < endPlaytime) ||
  //   (schedule.end >= startPlaytime && schedule.end < endPlaytime) ||
  //   (schedule.start < startPlaytime && schedule.end >= endPlaytime))

  const spillsToNextDay = (schedule: Schedule): boolean => {
    const [activeStart, activeEnd] = [schedule.start, (schedule.end < schedule.start ? schedule.end + Timeframes.WEEK : schedule.end)]

    return (activeStart >= startPlaytime && activeStart < endPlaytime) && !(activeEnd >= startPlaytime && activeEnd < endPlaytime)
  }

  const spillsFromPreviousDay = (schedule: Schedule): boolean => {
    const [activeStart, activeEnd] = [schedule.start, schedule.end]

    return !(activeStart >= startPlaytime && activeStart < endPlaytime) && (activeEnd >= startPlaytime && activeEnd < endPlaytime)
  }

  const spansFullDay = (schedule: Schedule): boolean => {
    const [activeStart, activeEnd] = [(schedule.end < schedule.start ? schedule.start - Timeframes.WEEK : schedule.start), schedule.end]

    return (activeStart < startPlaytime && activeEnd >= endPlaytime)
  }

  const getRoundedClass = (schedule: Schedule): string => {
    if (spansFullDay(schedule)) {
      return 'border-bottom border-top border-warning border-2'
    } else if (spillsToNextDay(schedule)) {
      return 'rounded-top border-bottom border-warning border-2'
    } else if (spillsFromPreviousDay(schedule)) {
      return 'rounded-bottom border-top border-warning border-2'
    } else {
      return 'rounded'
    }
  }

  const getHeight = (schedule: Schedule): number => {
    if (spansFullDay(schedule)) {
      return Timeframes.DAY + 120
    } else if (spillsFromPreviousDay(schedule)) {
      return schedule.end % Timeframes.DAY + 60
    } else {
      return Math.min(schedule.option.totalTime, Timeframes.DAY - (schedule.start % Timeframes.DAY) + 60)
    }
  }

  return (
    <OverlayTrigger
      placement={tooltipPosition}
      overlay={<Tooltip className='tooltip-large' style={{ position: 'fixed' }}><ScheduleDetailsTooltip schedule={schedule} /></Tooltip>}
      key={schedule.contract.id}
    >
      <div
        className={`d-flex align-items-center justify-content-center bg-info bg-opacity-${schedule.contract.startTime <= Controllers.Clock.playtime ? '75' : '25'} hover-bg-info ${getRoundedClass(schedule)} cursor-help`}
        style={{
          position: 'absolute',
          top: `${spansFullDay(schedule) || spillsFromPreviousDay(schedule) ? 10 : schedule.start % Timeframes.DAY / 6 + 20}px`,
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
