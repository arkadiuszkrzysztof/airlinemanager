import { Clock } from './helpers/Clock'
import { AirlineController } from './AirlineController'
import { HangarController } from './HangarController'
import { MarketController } from './MarketController'
import { ContractsController } from './ContractsController'
import { ScheduleController } from './ScheduleController'

export interface Controllers {
  Game: GameController
  Airline: AirlineController
  Market: MarketController
  Hangar: HangarController
  Contracts: ContractsController
  Schedule: ScheduleController
  Clock: Clock
}
export class GameController {
  private readonly airlineController: AirlineController
  private readonly marketController: MarketController
  private readonly hangarController: HangarController
  private readonly contractsController: ContractsController
  private readonly scheduleController: ScheduleController
  private readonly clock: Clock

  private static instance: GameController

  private constructor () {
    this.airlineController = AirlineController.getInstance()
    this.marketController = MarketController.getInstance()
    this.hangarController = HangarController.getInstance()
    this.contractsController = ContractsController.getInstance()
    this.scheduleController = ScheduleController.getInstance()
    this.clock = Clock.getInstance()
  }

  public static getInstance (): Controllers {
    if (GameController.instance === undefined) {
      GameController.instance = new GameController()
    }

    return {
      Game: this.instance,
      Airline: this.instance.airlineController,
      Market: this.instance.marketController,
      Hangar: this.instance.hangarController,
      Contracts: this.instance.contractsController,
      Schedule: this.instance.scheduleController,
      Clock: this.instance.clock
    }
  }
}
