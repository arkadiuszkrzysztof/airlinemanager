import { Autobind } from './helpers/Autobind'
import { type Contract } from '../models/Contract'
import { Clock, Timeframes } from './helpers/Clock'
import { ContractsController, type ContractOption } from './ContractsController'
import { HangarController, type HangarAsset } from './HangarController'
import { LocalStorage } from './helpers/LocalStorage'
import { AirlineController, EventOrigin, ReputationType } from './AirlineController'
import { AchievementType, MissionController } from './MissionController'

export interface Schedule {
  start: number
  end: number
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

  public getActiveSchedulesForDestination (destinationCode: string): Schedule[] {
    return this.activeSchedules.filter(schedule => schedule.contract.destination.IATACode === destinationCode)
  }

  public getActiveSchedulesForPlaneType (planeType: string): Schedule[] {
    return this.activeSchedules.filter(schedule => schedule.option.asset.plane.typeName === planeType)
  }

  public removeActiveSchedulesForAsset (asset: HangarAsset): void {
    this.activeSchedules = this.activeSchedules.filter(schedule => schedule.option.asset.plane.registration !== asset.plane.registration)
    LocalStorage.setActiveSchedules(this.activeSchedules)
  }

  public getTodaySchedules (day?: string): Schedule[] {
    const clock = Clock.getInstance()

    const startPlaytime = day !== undefined ? clock.getPlaytimeForDay(day) : clock.todayStartPlaytime % Timeframes.WEEK
    const endPlaytime = day !== undefined ? clock.getPlaytimeForDay(day) + Timeframes.DAY : clock.tomorrowStartPlaytime % Timeframes.WEEK

    return this.getActiveSchedules().filter(schedule =>
      !ContractsController.getInstance().canAssignSchedule([{ start: startPlaytime, end: endPlaytime }], schedule))
  }

  public getTodaySchedulesForAsset (asset: HangarAsset, day?: string): Schedule[] {
    return this.getTodaySchedules(day).filter(schedule => schedule.option.asset.plane.registration === asset.plane.registration)
  }

  public getUseTimeForAsset (asset: HangarAsset, day: string): number {
    const startPlaytime = Clock.getInstance().getPlaytimeForDay(day)
    const endPlaytime = Clock.getInstance().getPlaytimeForDay(day) + Timeframes.DAY

    return this.getTodaySchedulesForAsset(asset, day).reduce((sum, schedule) => {
      const [scheduleStart, scheduleEnd] = [schedule.start, schedule.end < schedule.start ? schedule.end + Timeframes.WEEK : schedule.end]

      if (startPlaytime <= scheduleStart && scheduleStart <= endPlaytime) {
        return sum + Math.min(schedule.option.totalTime, endPlaytime - scheduleStart)
      } else if ((startPlaytime <= scheduleEnd && scheduleEnd <= endPlaytime)) {
        return sum + Math.min(schedule.option.totalTime, scheduleEnd - startPlaytime)
      } else if (schedule.end < schedule.start && schedule.end >= startPlaytime && schedule.end <= endPlaytime) {
        return sum + Math.min(schedule.option.totalTime, schedule.end - startPlaytime)
      } else if (startPlaytime > scheduleStart && scheduleEnd > endPlaytime) {
        return sum + Timeframes.DAY
      }
      return sum
    }, 0)
  }

  public getAverageUtilizationForAsset (asset: HangarAsset, day: string): number {
    const activeSchedules = this.getTodaySchedulesForAsset(asset, day)
    const totalUtilization = activeSchedules.reduce((sum, schedule) => sum + schedule.option.utilization, 0)

    return (activeSchedules.length > 0 ? Math.floor(totalUtilization / activeSchedules.length) : 0)
  }

  public getWeeklyAverageUseTime (): number {
    if (this.getActiveSchedules().length === 0) return 0

    return this.getActiveSchedules().reduce((sum, schedule) => sum + schedule.option.totalTime, 0) / HangarController.getInstance().getAssetsCount()
  }

  public getWeeklyAverageUtilization (): number {
    if (this.getActiveSchedules().length === 0) return 0
    return this.getActiveSchedules().reduce((sum, schedule) => sum + schedule.option.utilization, 0) / this.getActiveSchedules().length
  }

  public getWeeklyRevenue (): number {
    return this.getActiveSchedules().reduce((sum, schedule) => sum + schedule.option.revenue.total, 0)
  }

  public getWeeklyCost (): number {
    return this.getActiveSchedules().reduce((sum, schedule) => sum + schedule.option.cost.total, 0)
  }

  public draftSchedule (contract: Contract, option: ContractOption): Schedule {
    let start = contract.departureTime - option.boardingTime
    start = start < 0 ? start + Timeframes.WEEK : start % Timeframes.WEEK
    const end = (start + option.totalTime) % Timeframes.WEEK

    const schedule = {
      start,
      end,
      contract,
      option
    }

    return schedule
  }

  public acceptContract (contract: Contract, option: ContractOption): void {
    const schedule = this.draftSchedule(contract, option)

    const wasAccepted = schedule.contract.accepted

    schedule.contract.accept()
    schedule.option.asset.plane.setHub(schedule.contract.hub)
    this.activeSchedules.push(schedule)
    LocalStorage.setActiveSchedules(this.activeSchedules)

    HangarController.getInstance().saveAssets()

    ContractsController.getInstance().getContractOffMarket(contract, wasAccepted)

    AirlineController.getInstance().logEvent(EventOrigin.CONTRACT, `Accepted ${contract.hub.IATACode}-${contract.destination.IATACode} contract for plane ${schedule.option.asset.plane.registration} on ${Clock.getDayOfWeek(schedule.contract.departureTime)}s for the next ${contract.contractDuration / Timeframes.MONTH} months`)

    AirlineController.getInstance().gainReputation(contract.id, ReputationType.CONNECTION, contract.reputation)

    MissionController.getInstance().notifyAchievements(AchievementType.REPUTATION)
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
    const clock = Clock.getInstance()
    const lastRegistration = LocalStorage.getLastScheduleEventsRegistration()

    // Register flights starting today as events
    if (lastRegistration === -1 || playtime - lastRegistration >= Timeframes.DAY) {
      const startPlaytime = clock.todayStartPlaytime % Timeframes.WEEK
      const endPlaytime = clock.tomorrowStartPlaytime % Timeframes.WEEK

      ScheduleController.getInstance()
        .getTodaySchedules()
        .filter(schedule => schedule.start >= startPlaytime && schedule.start <= endPlaytime)
        .forEach(schedule => {
          this.scheduleEvents.push({
            executionTime: clock.thisWeekStartPlaytime + (schedule.end < schedule.start ? schedule.end + Timeframes.WEEK : schedule.end),
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

      MissionController.getInstance().notifyMissions(event.schedule)

      LocalStorage.setScheduleEvents(this.scheduleEvents)

      // Expire contract after the last occurence if it's over
      if (event.schedule.contract.expirationTime <= playtime) {
        this.expireContract(event.schedule)

        AirlineController.getInstance().logEvent(EventOrigin.CONTRACT, `Contract ${event.schedule.contract.hub.IATACode}-${event.schedule.contract.destination.IATACode} for plane ${event.schedule.option.asset.plane.registration} on ${Clock.getDayOfWeek(event.schedule.contract.departureTime)}s expired`)
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

  public static flightStatus = (schedule: Schedule): { inTheAir: boolean, flightLeg: 'there' | 'back' } => {
    const clock = Clock.getInstance()
    let inTheAir = false
    let flightLeg: 'there' | 'back' = 'there'

    if (schedule.contract.startTime > clock.playtime) {
      return { inTheAir, flightLeg }
    }

    const thisWeekStartPlaytime = clock.thisWeekStartPlaytime
    const [scheduleStart, scheduleEnd] = [thisWeekStartPlaytime + schedule.start, thisWeekStartPlaytime + (schedule.end < schedule.start ? schedule.end + Timeframes.WEEK : schedule.end)]
    const halftime = scheduleStart + Math.floor(schedule.option.totalTime / 2)

    if ((scheduleStart <= clock.playtime && scheduleEnd >= clock.playtime) ||
    (scheduleStart - Timeframes.WEEK <= clock.playtime && scheduleEnd - Timeframes.WEEK >= clock.playtime)) {
      inTheAir = true
    }

    if (clock.playtime > halftime || (scheduleStart - Timeframes.WEEK <= clock.playtime && scheduleEnd - Timeframes.WEEK >= clock.playtime && clock.playtime > halftime - Timeframes.WEEK)) {
      flightLeg = 'back'
    }

    return { inTheAir, flightLeg }
  }
}
