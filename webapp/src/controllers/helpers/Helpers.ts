import { type Schedule } from '../ScheduleController'
import { Clock } from './Clock'

export const getRandomCharacters = (length: number, includeNumbers: boolean = false): string => {
  const characters = includeNumbers ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const getDepreciation = (price: number, age: number): number => {
  for (let i = 1; i <= age; i++) {
    price *= (1 - (40 - i) / 500)
  }
  return price
}

export const formatTurnaround = (turnaround: number): string => {
  return `${Math.floor(turnaround / 60)}h ${Math.floor(turnaround % 60)}m`
}

export const formatCashValue = (value: number): string => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export const formatUtilization = (utilization: number): string => {
  return `${utilization}%`
}

export const formatPercentageValue = (value: number): string => {
  return `${Math.floor(value * 100)}%`
}

export const flightStatus = (schedule: Schedule): { inTheAir: boolean, flightLeg: 'there' | 'back' } => {
  let inTheAir = false
  let flightLeg: 'there' | 'back' = 'there'

  const halftime = Clock.addToTime(schedule.start, Math.floor(schedule.option.totalTime / 2))

  if (
    (schedule.day === Clock.getInstance().currentDayOfWeek &&
      Clock.isCurrentTimeBetween(schedule.start, schedule.end)) ||
    (schedule.day === Clock.getInstance().previousDayOfWeek &&
      schedule.end < schedule.start &&
      Clock.isCurrentTimeBetween(schedule.start, schedule.end))
  ) {
    inTheAir = true

    if (Clock.getInstance().playtimeFormatted > halftime) {
      flightLeg = 'back'
    }
  }

  return { inTheAir, flightLeg }
}
