import { AirlineController } from './AirlineController'
import { HangarController } from './HangarController'
import { PlanesController } from './PlanesController'

export class GameController {
  private readonly airlineController: AirlineController
  private readonly planesController: PlanesController
  private readonly hangarController: HangarController

  private static instance: GameController

  private constructor () {
    this.airlineController = AirlineController.getInstance()
    this.planesController = PlanesController.getInstance()
    this.hangarController = HangarController.getInstance()
  }

  public static getInstance (): {
    Game: GameController
    Airline: AirlineController
    Planes: PlanesController
    Hangar: HangarController
  } {
    if (GameController.instance === undefined) {
      GameController.instance = new GameController()
    }

    return {
      Game: this.instance,
      Airline: this.instance.airlineController,
      Planes: this.instance.planesController,
      Hangar: this.instance.hangarController
    }
  }
}
