import { LocalStorage } from './LocalStorage'

export enum Timeframes {
  HOUR = 60,
  DAY = 1440,
  WEEK = 10080,
  MONTH = 43200,
  YEAR = 525600
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

  private constructor () {
    const playtime = LocalStorage.getPlaytime()
    const offlineTime = LocalStorage.getOfflineTime()
    const lastSave = LocalStorage.getLastSave()
    const currentTime = Math.floor(Date.now() / 1000)

    this._playtime = playtime + Math.min(offlineTime, Math.max(lastSave - currentTime, 0))

    setInterval(() => { this.updateClock() }, 1000)
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

  public static getInstance (): Clock {
    if (Clock.instance === undefined) {
      Clock.instance = new Clock()
    }

    return Clock.instance
  }

  public registerListener (name: string, listener: (playtime: number) => void): void {
    this.listeners[name] = listener
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
