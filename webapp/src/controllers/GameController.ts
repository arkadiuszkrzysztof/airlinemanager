import { Clock } from './Clock'
import { AirlineController } from './AirlineController'
import { HangarController } from './HangarController'
import { MarketController } from './MarketController'
import { ContractsController } from './ContractsController'

export class GameController {
  private readonly airlineController: AirlineController
  private readonly marketController: MarketController
  private readonly hangarController: HangarController
  private readonly contractsController: ContractsController
  private readonly clock: Clock

  private static instance: GameController

  private constructor () {
    this.airlineController = AirlineController.getInstance()
    this.marketController = MarketController.getInstance()
    this.hangarController = HangarController.getInstance()
    this.contractsController = ContractsController.getInstance()
    this.clock = Clock.getInstance()
  }

  public static getInstance (): {
    Game: GameController
    Airline: AirlineController
    Market: MarketController
    Hangar: HangarController
    Contracts: ContractsController
    Clock: Clock
  } {
    if (GameController.instance === undefined) {
      GameController.instance = new GameController()
    }

    return {
      Game: this.instance,
      Airline: this.instance.airlineController,
      Market: this.instance.marketController,
      Hangar: this.instance.hangarController,
      Contracts: this.instance.contractsController,
      Clock: this.instance.clock
    }
  }

  public static displayMessage (message: string): void {
    console.log('MESSAGE: ', message)
  }
}
