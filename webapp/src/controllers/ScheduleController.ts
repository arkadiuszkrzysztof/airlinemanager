import { Autobind } from '../decorators/Autobind'
import { type Contract } from '../models/Contract'
import { Clock, Timeframes, type DaysOfWeek } from './Clock'
import { ContractsController, type ContractOption } from './ContractsController'
import { type HangarAsset } from './HangarController'
import { LocalStorage } from './LocalStorage'

export interface Schedule {
  day: DaysOfWeek
  start: string
  end: string
  contract: Contract
  option: ContractOption
}

export interface ScheduleEvent {
  executionTime: number
  schedule: Schedule
}

export class ScheduleController {
  private static instance: ScheduleController
  private readonly activeSchedules: Schedule[]
  private scheduleEvents: ScheduleEvent[]

  private constructor () {
    this.activeSchedules = LocalStorage.getActiveSchedules()
    this.scheduleEvents = LocalStorage.getScheduleEvents()
  }

  public static getInstance (): ScheduleController {
    if (ScheduleController.instance === undefined) {
      ScheduleController.instance = new ScheduleController()
    }
    return ScheduleController.instance
  }

  public getActiveSchedulesForAsset (asset: HangarAsset): Schedule[] {
    return this.activeSchedules.filter(schedule => schedule.option.asset.plane.registration === asset.plane.registration)
  }

  public getTodaySchedules (): Schedule[] {
    return this.activeSchedules.filter(schedule => schedule.day === Clock.getInstance().currentDayOfWeek)
  }

  public getTotalUseTime (asset: HangarAsset, day: DaysOfWeek): string {
    const totalTime = this.getActiveSchedulesForAsset(asset)
      .filter((schedule) => schedule.day === day)
      .reduce((sum, schedule) => sum + schedule.option.turnaround, 0)

    return `${Math.floor(totalTime / 60).toString().padStart(2, '0')}:${(totalTime % 60).toString().padStart(2, '0')}`
  }

  public draftSchedule (contract: Contract, option: ContractOption): Schedule {
    const start = Clock.addToTime(contract.departureTime, -Math.floor(option.turnaround / 2))
    const end = Clock.addToTime(start, Math.floor(option.turnaround))

    const schedule = {
      day: contract.dayOfWeek,
      start,
      end,
      contract,
      option
    }

    return schedule
  }

  public acceptContract (contract: Contract, option: ContractOption): void {
    const schedule = this.draftSchedule(contract, option)

    this.activeSchedules.push(schedule)
    LocalStorage.setActiveSchedules(this.activeSchedules)

    ContractsController.getInstance().getContractOffMarket(contract)
  }

  @Autobind
  public executeEvents (time: number): void {
    if (time % Timeframes.DAY === 0) {
      ScheduleController.getInstance().getTodaySchedules().forEach(schedule => {
        this.scheduleEvents.push({
          executionTime: Clock.getTimeAt(schedule.end, schedule.end < schedule.start),
          schedule
        })
        console.log(`Event scheduled: Flight ${schedule.contract.hub.IATACode}-${schedule.contract.destination.IATACode}`)
      })

      LocalStorage.setScheduleEvents(this.scheduleEvents)
    }

    if (this.scheduleEvents.length === 0) return

    this.scheduleEvents.filter(event => event.executionTime <= time).forEach(event => {
      console.log(`Event: Flight ${event.schedule.contract.hub.IATACode}-${event.schedule.contract.destination.IATACode} completed`)
      this.scheduleEvents = this.scheduleEvents.filter(e => e.schedule.contract.id !== event.schedule.contract.id)

      LocalStorage.setScheduleEvents(this.scheduleEvents)
    })
  }
}
