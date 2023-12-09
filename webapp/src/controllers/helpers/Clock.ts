import { type Schedule } from '../ScheduleController'
import { LocalStorage } from './LocalStorage'

export enum Timeframes {
  HOUR = 60,
  DAY = 1440,
  WEEK = 10080,
  MONTH = 40320,
  YEAR = 483840
}

export enum DaysOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

export class Clock {
  private static instance: Clock
  private readonly listeners: Record<string, (playtime: number) => void> = {}
  private _playtime: number
  private clockTicker: NodeJS.Timeout

  private constructor () {
    const playtime = LocalStorage.getPlaytime()
    const offlineTime = LocalStorage.getOfflineTime()
    const lastSave = LocalStorage.getLastSave()
    const currentTime = Math.floor(Date.now() / 1000)

    this._playtime = playtime + Math.min(offlineTime, Math.max(lastSave - currentTime, 0))

    this.clockTicker = setInterval(() => { this.updateClock() }, 100)
  }

  private callListeners (playtime: number): void {
    Object.values(this.listeners).forEach(listener => { listener(playtime) })
  }

  private updateClock (): void {
    this._playtime += 1
    LocalStorage.setPlaytime(this._playtime)
    LocalStorage.setLastSave(Math.floor(Date.now() / 1000))
    this.callListeners(this._playtime)
  }

  public pauseGame (): void {
    clearInterval(this.clockTicker)
  }

  public resumeGame (): void {
    this.clockTicker = setInterval(() => { this.updateClock() }, 100)
  }

  public static getInstance (): Clock {
    if (Clock.instance === undefined) {
      Clock.instance = new Clock()
    }

    return Clock.instance
  }

  public registerListener (name: string, listener: (playtime: number) => void): void {
    this.listeners[name] = listener
  }

  public static addToTime (time: string, delta: number): string {
    const [hours, minutes] = time.split(':')
    const newMinutes = parseInt(minutes) + delta
    const newHours = (parseInt(hours) + Math.floor(newMinutes / 60)) % 24

    return `${(newHours < 0 ? newHours + 24 : newHours).toString().padStart(2, '0')}:${(newMinutes < 0 ? newMinutes % 60 + 60 : newMinutes % 60).toString().padStart(2, '0')}`
  }

  public static getTimeClosestDayStart (day: DaysOfWeek): number {
    const thisDayStart = this.instance.timeThisDayStart
    const thisDayIndex = Object.values(DaysOfWeek).indexOf(this.instance.currentDayOfWeek as DaysOfWeek)

    const closestDayIndex = Object.values(DaysOfWeek).indexOf(day)
    const closestDayStart = thisDayStart + (closestDayIndex <= thisDayIndex ? closestDayIndex + 7 - thisDayIndex : closestDayIndex - thisDayIndex) * Timeframes.DAY

    return closestDayStart
  }

  public static getTimeAt (time: string, when: 'yesterday' | 'today' | 'tomorrow' = 'today'): number {
    const [hours, minutes] = time.split(':')
    const delta = (when === 'tomorrow' ? Timeframes.DAY : when === 'yesterday' ? -Timeframes.DAY : 0)

    return parseInt(hours) * 60 + parseInt(minutes) + this.instance.timeThisDayStart + delta
  }

  public static getFormattedTimeUntil (time: number): string {
    const { HOUR, DAY, MONTH, YEAR } = Timeframes

    const years = Math.floor(Math.abs(time - this.instance.playtime) / YEAR)
    const months = Math.floor(Math.abs(time - this.instance.playtime) / MONTH) % 12
    const days = Math.floor(Math.abs(time - this.instance.playtime) / DAY) % 28
    const hours = Math.floor(Math.abs(time - this.instance.playtime) / HOUR) % 24
    const minutes = Math.abs(time - this.instance.playtime) % HOUR

    if (years > 0) {
      return years + (years !== 1 ? ' years ' : ' year ') + months + (months !== 1 ? ' months' : ' month')
    } else if (months > 0) {
      return months + (months !== 1 ? ' months ' : ' month ') + days + (days !== 1 ? ' days' : ' day')
    } else if (days > 0) {
      return days + (days !== 1 ? ' days ' : ' day ') + hours + (hours !== 1 ? ' hours' : ' hour')
    } else {
      return hours + (hours !== 1 ? ' hours ' : ' hour ') + minutes + (minutes !== 1 ? ' minutes' : ' minute')
    }
  }

  public static getExpirationTime (time: number): [number, number] {
    const { HOUR, DAY } = Timeframes

    const days = Math.floor(Math.abs(time - this.instance.playtime) / DAY) % 28
    const hours = Math.floor(Math.abs(time - this.instance.playtime) / HOUR) % 24

    return [days, hours]
  }

  public static getFormattedHourlyTime (time: number, limitTo24h: boolean = false): string {
    const { HOUR } = Timeframes
    const hours = (limitTo24h ? Math.floor(time / HOUR) % 24 : Math.floor(time / HOUR))
    const minutes = time % HOUR

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  public static isTimeBetween (time: string, start: string, end: string): boolean {
    if (end < start) {
      if ((start <= time && end <= time) ||
        (start >= time && end >= time)) {
        return true
      } else {
        return false
      }
    } else {
      if (start <= time && end >= time) {
        return true
      } else {
        return false
      }
    }
  }

  public static isCurrentTimeBetween (start: string, end: string): boolean {
    const time = this.instance.playtimeFormatted
    return this.isTimeBetween(time, start, end)
  }

  public static sumUpTimes (times: string[]): string {
    const minutes = times.reduce((sum, time) => {
      const [hours, minutes] = time.split(':')
      return sum + parseInt(hours) * 60 + parseInt(minutes)
    }, 0)

    return `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`
  }

  public static formatPlaytimeInYearsAndMonths (playtime: number): string {
    const years = Math.floor(playtime / Timeframes.YEAR)
    const months = Math.floor((playtime % Timeframes.YEAR) / Timeframes.MONTH)
    return (years > 0 ? `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'}` : `${months} ${months === 1 ? 'month' : 'months'}`)
  }

  public static flightStatus = (schedule: Schedule): { inTheAir: boolean, flightLeg: 'there' | 'back' } => {
    let inTheAir = false
    let flightLeg: 'there' | 'back' = 'there'

    const halftime = this.addToTime(schedule.start, Math.floor(schedule.option.totalTime / 2))

    if (
      schedule.day === this.instance.currentDayOfWeek &&
      this.instance.playtimeFormatted >= schedule.start &&
      this.isCurrentTimeBetween(schedule.start, schedule.end)
    ) {
      inTheAir = true
    } else if (
      schedule.day === this.instance.previousDayOfWeek &&
      schedule.end < schedule.start &&
      this.isCurrentTimeBetween('00:00', schedule.end)
    ) {
      inTheAir = true
    }

    if (this.instance.playtimeFormatted > halftime) {
      flightLeg = 'back'
    }

    return { inTheAir, flightLeg }
  }

  get playtime (): number {
    return this._playtime
  }

  get playtimeFormatted (): string {
    const hours = Math.floor(this._playtime / 60) % 24
    const minutes = this._playtime % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  get currentDayOfWeek (): string {
    const day = Math.floor(this._playtime / Timeframes.DAY) % Object.keys(DaysOfWeek).length
    return Object.values(DaysOfWeek)[day]
  }

  get previousDayOfWeek (): string {
    const day = (Math.floor(this._playtime / Timeframes.DAY) - 1) % Object.keys(DaysOfWeek).length
    return Object.values(DaysOfWeek)[day]
  }

  get nextDayOfWeek (): string {
    const day = (Math.floor(this._playtime / Timeframes.DAY) + 1) % Object.keys(DaysOfWeek).length
    return Object.values(DaysOfWeek)[day]
  }

  get timeThisDayStart (): number {
    return Math.floor(this._playtime / Timeframes.DAY) * Timeframes.DAY
  }

  get timeThisMonthStart (): number {
    return Math.floor(this._playtime / Timeframes.MONTH) * Timeframes.MONTH
  }

  get timeToNextDay (): string {
    const { HOUR, DAY } = Timeframes
    const hours = Math.floor((DAY - this._playtime % DAY) / HOUR)
    const minutes = (DAY - this._playtime % DAY) % HOUR

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`
  }

  get timeToNextWeek (): string {
    const days = Math.floor((10080 - (this._playtime % 10080)) / 1440)
    const hours = Math.floor((10080 - (this._playtime % 10080)) / 60) % 24
    const minutes = (10080 - (this._playtime % 10080)) % 60

    return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`
  }

  get totalPlaytime (): string {
    const { HOUR, DAY, WEEK, MONTH, YEAR } = Timeframes
    const years = Math.floor(this._playtime / YEAR)
    const months = Math.floor((this._playtime % YEAR) / MONTH)
    const weeks = Math.floor((this._playtime % MONTH) / WEEK)
    const days = Math.floor((this._playtime % WEEK) / DAY)
    const hours = Math.floor((this._playtime % DAY) / HOUR)
    const minutes = this._playtime % HOUR

    return `${years}y ${months}m ${weeks}w ${days}d ${hours}h ${minutes}m`
  }
}
