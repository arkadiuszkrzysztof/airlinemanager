import { Autobind } from '../decorators/Autobind'
import { type Contract } from '../models/Contract'
import { Clock, Timeframes, type DaysOfWeek } from './helpers/Clock'
import { ContractsController, type ContractOption } from './ContractsController'
import { HangarController, type HangarAsset } from './HangarController'
import { LocalStorage } from './helpers/LocalStorage'
import { AirlineController, EventOrigin, ReputationType } from './AirlineController'

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
  private activeSchedules: Schedule[]
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

  public getActiveSchedules (): Schedule[] {
    return this.activeSchedules
  }

  public getActiveSchedulesForAsset (asset: HangarAsset): Schedule[] {
    return this.activeSchedules.filter(schedule => schedule.option.asset.plane.registration === asset.plane.registration)
  }

  public removeActiveSchedulesForAsset (asset: HangarAsset): void {
    this.activeSchedules = this.activeSchedules.filter(schedule => schedule.option.asset.plane.registration !== asset.plane.registration)
    LocalStorage.setActiveSchedules(this.activeSchedules)
  }

  public getTodaySchedules (): Schedule[] {
    return this.activeSchedules.filter(schedule => schedule.day === Clock.getInstance().currentDayOfWeek)
  }

  public getTotalUseTime (asset: HangarAsset, day: DaysOfWeek): string {
    const totalTime = this.getActiveSchedulesForAsset(asset)
      .filter((schedule) => schedule.day === day)
      .reduce((sum, schedule) => sum + schedule.option.totalTime, 0)

    return `${Math.floor(totalTime / 60).toString().padStart(2, '0')}:${(totalTime % 60).toString().padStart(2, '0')}`
  }

  public getAverageUtilization (asset: HangarAsset, day: DaysOfWeek): number {
    const activeSchedules = this.getActiveSchedulesForAsset(asset).filter((schedule) => schedule.day === day)
    const totalUtilization = activeSchedules.reduce((sum, schedule) => sum + schedule.option.utilization, 0)

    return (activeSchedules.length > 0 ? Math.floor(totalUtilization / activeSchedules.length) : 0)
  }

  public draftSchedule (contract: Contract, option: ContractOption): Schedule {
    const start = Clock.addToTime(contract.departureTime, -option.boardingTime)
    const end = Clock.addToTime(start, Math.floor(option.totalTime))

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

    const wasPreviouslyAccepted = schedule.contract.accepted
    schedule.contract.accept()
    schedule.option.asset.plane.setHub(schedule.contract.hub)
    HangarController.getInstance().saveAssets()

    this.activeSchedules.push(schedule)
    LocalStorage.setActiveSchedules(this.activeSchedules)

    ContractsController.getInstance().getContractOffMarket(contract, wasPreviouslyAccepted)

    AirlineController.getInstance().logEvent(EventOrigin.CONTRACT, `Accepted ${contract.hub.IATACode}-${contract.destination.IATACode} contract for plane ${schedule.option.asset.plane.registration} on ${schedule.contract.dayOfWeek}s for the next ${contract.contractDuration / Timeframes.MONTH} months`)

    AirlineController.getInstance().gainReputation(contract.id, ReputationType.CONNECTION, contract.reputation)
  }

  public expireContract (schedule: Schedule): void {
    this.activeSchedules = this.activeSchedules.filter(s => s.contract.id !== schedule.contract.id)
    LocalStorage.setActiveSchedules(this.activeSchedules)

    AirlineController.getInstance().loseReputation(schedule.contract.id)

    if (this.getActiveSchedulesForAsset(schedule.option.asset).length === 0) {
      schedule.option.asset.plane.setHub(undefined)
      HangarController.getInstance().saveAssets()
    }
  }

  @Autobind
  public registerAndExecuteEvents (playtime: number): void {
    const lastRegistration = LocalStorage.getLastScheduleEventsRegistration()

    // Register flights for the entire day as events
    if (lastRegistration === 0 || playtime - lastRegistration >= Timeframes.DAY) {
      ScheduleController.getInstance().getTodaySchedules().forEach(schedule => {
        this.scheduleEvents.push({
          executionTime: Clock.getTimeAt(schedule.end, schedule.end < schedule.start),
          schedule
        })
        console.log(`Event scheduled: Flight ${schedule.contract.hub.IATACode}-${schedule.contract.destination.IATACode}`)
      })

      LocalStorage.setLastScheduleEventsRegistration(playtime - playtime % Timeframes.DAY)
      LocalStorage.setScheduleEvents(this.scheduleEvents)
    }

    if (this.scheduleEvents.length === 0) return

    // Execute events that are due
    this.scheduleEvents.filter(event => event.executionTime <= playtime).forEach(event => {
      AirlineController.getInstance().settleFlight(event.schedule)
      console.log(`Event: Flight ${event.schedule.contract.hub.IATACode}-${event.schedule.contract.destination.IATACode} completed`)
      this.scheduleEvents = this.scheduleEvents.filter(e => e.schedule.contract.id !== event.schedule.contract.id)

      LocalStorage.setScheduleEvents(this.scheduleEvents)

      // Expire contract after the last occurence if it's over
      if (event.schedule.contract.expirationTime <= playtime) {
        this.expireContract(event.schedule)

        AirlineController.getInstance().logEvent(EventOrigin.CONTRACT, `Contract ${event.schedule.contract.hub.IATACode}-${event.schedule.contract.destination.IATACode} for plane ${event.schedule.option.asset.plane.registration} on ${event.schedule.contract.dayOfWeek}s expired`)
      }
    })

    // Expire plane leases if they're over
    HangarController.getInstance().getLeasedAssets().forEach(asset => {
      if (asset.plane.leaseExpirationTime !== undefined && asset.plane.leaseExpirationTime <= playtime) {
        AirlineController.getInstance().logEvent(EventOrigin.MARKET, `Lease for ${asset.plane.familyName} ${asset.plane.typeName} (${asset.plane.registration}) expired`)

        AirlineController.getInstance().loseReputation(asset.plane.registration)

        HangarController.getInstance().removeAsset(asset)
      }
    })
  }
}
