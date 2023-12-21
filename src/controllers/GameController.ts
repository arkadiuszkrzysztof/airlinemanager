import { Clock } from './helpers/Clock'
import { AirlineController } from './AirlineController'
import { HangarController } from './HangarController'
import { MarketController } from './MarketController'
import { ContractsController } from './ContractsController'
import { ScheduleController } from './ScheduleController'
import { MissionController } from './MissionController'
import { LocalStorage } from './helpers/LocalStorage'
import { getRandomCharacters } from './helpers/Helpers'
import { Autobind } from './helpers/Autobind'

export interface Controllers {
  Game: GameController
  Airline: AirlineController
  Market: MarketController
  Hangar: HangarController
  Contracts: ContractsController
  Schedule: ScheduleController
  Mission: MissionController
  Clock: Clock
}

export type DistanceUnits = 'km' | 'mi' | 'nmi'
export type SpeedUnits = 'kph' | 'mph' | 'kts'
export type WeightUnits = 'kg' | 'lb'

const Conversions = {
  KM: 1,
  KPH: 1,
  KG: 1,
  MI: 0.621371,
  MPH: 0.621371,
  NMI: 0.539957,
  KTS: 0.539957,
  LB: 2.20462
}

export class GameController {
  private readonly airlineController: AirlineController
  private readonly marketController: MarketController
  private readonly hangarController: HangarController
  private readonly contractsController: ContractsController
  private readonly scheduleController: ScheduleController
  private readonly missionController: MissionController
  private readonly clock: Clock

  private static instance: GameController

  private distanceUnits: DistanceUnits
  private speedUnits: SpeedUnits
  private weightUnits: WeightUnits

  private constructor () {
    this.airlineController = AirlineController.getInstance()
    this.marketController = MarketController.getInstance()
    this.hangarController = HangarController.getInstance()
    this.contractsController = ContractsController.getInstance()
    this.scheduleController = ScheduleController.getInstance()
    this.missionController = MissionController.getInstance()
    this.clock = Clock.getInstance()

    this.distanceUnits = LocalStorage.getDistanceUnits()
    this.speedUnits = LocalStorage.getSpeedUnits()
    this.weightUnits = LocalStorage.getWeightUnits()
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
      Mission: this.instance.missionController,
      Clock: this.instance.clock
    }
  }

  private _generateGameId (): string {
    return `${getRandomCharacters(4, true)}-${getRandomCharacters(4, true)}-${getRandomCharacters(4, true)}`
  }

  public static isGameStarted (): boolean {
    return LocalStorage.getGameId() !== ''
  }

  public static startGame (airlineName: string, region: string): void {
    LocalStorage.setAirlineName(airlineName)
    LocalStorage.setStartingRegion(region)
    LocalStorage.setCash(1000000)
    LocalStorage.setGameId(GameController.getInstance().Game._generateGameId())
  }

  public static updateAirlineName (airlineName: string): void {
    AirlineController.getInstance().setAirlineName(airlineName)
    LocalStorage.setAirlineName(airlineName)
  }

  public static updateDistanceUnits (distanceUnits: DistanceUnits): void {
    this.instance.distanceUnits = distanceUnits
    LocalStorage.setDistanceUnits(distanceUnits)
  }

  public static updateSpeedUnits (speedUnits: SpeedUnits): void {
    this.instance.speedUnits = speedUnits
    LocalStorage.setSpeedUnits(speedUnits)
  }

  public static updateWeightUnits (weightUnits: WeightUnits): void {
    this.instance.weightUnits = weightUnits
    LocalStorage.setWeightUnits(weightUnits)
  }

  public static formatSpeed (speed: number): string {
    switch (this.instance.speedUnits) {
      case 'kph':
        return `${speed.toLocaleString('en-US', { maximumFractionDigits: 0 })} km/h`
      case 'mph':
        return `${Math.floor(speed * Conversions.MPH).toLocaleString('en-US', { maximumFractionDigits: 0 })} mph`
      case 'kts':
        return `${Math.floor(speed * Conversions.KTS).toLocaleString('en-US', { maximumFractionDigits: 0 })} kts`
    }
  }

  public static formatDistance (distance: number): string {
    switch (this.instance.distanceUnits) {
      case 'km':
        return `${distance.toLocaleString('en-US', { maximumFractionDigits: 0 })} km`
      case 'mi':
        return `${Math.floor(distance * Conversions.MI).toLocaleString('en-US', { maximumFractionDigits: 0 })} mi`
      case 'nmi':
        return `${Math.floor(distance * Conversions.NMI).toLocaleString('en-US', { maximumFractionDigits: 0 })} NM`
    }
  }

  public static formatWeight (weight: number): string {
    switch (this.instance.weightUnits) {
      case 'kg':
        return `${(weight * 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })} kg`
      case 'lb':
        return `${Math.floor(weight * 1000 * Conversions.LB).toLocaleString('en-US', { maximumFractionDigits: 0 })} lb`
    }
  }

  public static getUnits (): { distance: { units: string, conversion: number }, speed: { units: string, conversion: number }, weight: { units: string, conversion: number } } {
    return {
      distance: {
        units: this.instance.distanceUnits,
        conversion: Conversions[this.instance.distanceUnits.toUpperCase() as keyof typeof Conversions]
      },
      speed: {
        units: this.instance.speedUnits,
        conversion: Conversions[this.instance.speedUnits.toUpperCase() as keyof typeof Conversions]
      },
      weight: {
        units: this.instance.weightUnits,
        conversion: Conversions[this.instance.weightUnits.toUpperCase() as keyof typeof Conversions]
      }
    }
  }

  public static downloadSaveJSON (): void {
    const saveJSON = LocalStorage.getAllAsJSON()
    const blob = new Blob([saveJSON], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `airline-${LocalStorage.getGameId()}.json`
    link.href = url
    link.click()
  }

  @Autobind
  public static deleteGame (): void {
    if (window.confirm('Are you sure you want to delete this game?')) {
      this.instance.clock.pauseGame()
      LocalStorage.clear()
      window.location.reload()
    }
  }

  public static async loadDemo (): Promise<void> {
    const demoSave = await require('../demo/airline-demo.json')
    LocalStorage.clear()
    LocalStorage.setAllFromJSON(demoSave)
    window.location.reload()

    return demoSave
  }
}
