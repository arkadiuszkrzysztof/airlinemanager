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

    this.clockTicker = setInterval(() => { this.updateClock() }, 1000)
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
    this.clockTicker = setInterval(() => { this.updateClock() }, 1000)
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

  public static getTimeThisDayStart (): number {
    return Math.floor(this.instance.playtime / Timeframes.DAY) * Timeframes.DAY
  }

  public static getTimeClosestDayStart (day: DaysOfWeek): number {
    const thisDayStart = this.getTimeThisDayStart()
    const thisDayIndex = Object.values(DaysOfWeek).indexOf(this.instance.currentDayOfWeek as DaysOfWeek)

    const closestDayIndex = Object.values(DaysOfWeek).indexOf(day)
    const closestDayStart = thisDayStart + (closestDayIndex <= thisDayIndex ? closestDayIndex + 7 - thisDayIndex : closestDayIndex - thisDayIndex) * Timeframes.DAY

    return closestDayStart
  }

  public static getTimeAt (time: string, tomorrow: boolean = false): number {
    const [hours, minutes] = time.split(':')

    return parseInt(hours) * 60 + parseInt(minutes) + this.getTimeThisDayStart() + (tomorrow ? Timeframes.DAY : 0)
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
