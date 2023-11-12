import { type Contract } from '../models/Contract'
import { Clock, type DaysOfWeek } from './Clock'
import { type ContractOption } from './ContractsController'
import { type HangarAsset } from './HangarController'
import { LocalStorage } from './LocalStorage'

export interface Schedule {
  day: DaysOfWeek
  start: string
  end: string
  contract: Contract
  option: ContractOption
}

export class ScheduleController {
  private static instance: ScheduleController
  private readonly activeSchedules: Schedule[]

  private constructor () {
    this.activeSchedules = LocalStorage.getActiveSchedules()
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
  }
}
