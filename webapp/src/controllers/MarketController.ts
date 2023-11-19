import { Autobind } from '../decorators/Autobind'
import { Plane, PlanesData } from '../models/Plane'
import { AirlineController } from './AirlineController'
import { Clock, Timeframes } from './Clock'
import { LocalStorage } from './LocalStorage'
import { getDepreciation, getRandomCharacters } from './helpers/Helpers'

export class MarketController {
  private readonly planes: Plane[]
  private marketPlanes: Plane[]
  private static instance: MarketController
  private readonly AirlineController = AirlineController.getInstance()
  private readonly listeners: Record<string, (assets: Plane[]) => void> = {}

  private constructor () {
    this.planes = PlanesData.map(planeData => new Plane(...planeData))
    this.marketPlanes = LocalStorage.getMarketOffers()
  }

  public registerListener (name: string, listener: (assets: Plane[]) => void): void {
    this.listeners[name] = listener
  }

  private callListeners (assets: Plane[]): void {
    Object.values(this.listeners).forEach(listener => { listener(assets) })
  }

  getAllPlanes (): Plane[] {
    return this.planes
  }

  @Autobind
  getAvailablePlanes (playtime: number): Plane[] {
    const lastRefresh = LocalStorage.getLastMarketRefresh()

    if (lastRefresh === 0 || playtime - lastRefresh >= Timeframes.WEEK) {
      const newOffers = this.generatePlaneOptions()
      LocalStorage.setMarketOffers(newOffers)
      LocalStorage.setLastMarketRefresh(playtime - playtime % Timeframes.WEEK)
      this.callListeners([...newOffers])
      this.marketPlanes = newOffers
      return newOffers
    } else {
      return this.marketPlanes
    }
  }

  public getPlaneOffMarket (plane: Plane): void {
    this.marketPlanes = this.marketPlanes.filter(p => p.registration !== plane.registration)
    LocalStorage.setMarketOffers(this.marketPlanes)
    this.callListeners([...this.marketPlanes])
  }

  private generatePlaneOptions (): Plane[] {
    const calculatePricing = ({ pricing }: Plane, manufactureTime: number): { purchase: number, lease: number, leaseDuration: number, leaseCancelationFee: number, leaseDownpayment: number, maintenance: number } => {
      const age = Math.round((Clock.getInstance().playtime - manufactureTime) / Timeframes.YEAR)

      return {
        purchase: getDepreciation(pricing.purchase, age),
        lease: pricing.lease * (1 - age * 2 / 100),
        leaseDuration: Timeframes.MONTH * Math.floor(Math.random() * 60 + 36),
        leaseCancelationFee: pricing.leaseCancelationFee * (1 - age * 2 / 100),
        leaseDownpayment: pricing.leaseDownpayment * (1 - age * 2 / 100),
        maintenance: age > 5 ? pricing.maintenance * (1 + age * 2 / 100) : pricing.maintenance
      }
    }

    const tier = this.AirlineController.getTier()
    const constraints = tier.record.constraints

    const prototypes = this.planes.filter(plane => constraints.MTOW != null ? plane.MTOW <= constraints.MTOW : true)

    const numberOfOptions = Math.ceil(prototypes.length)
    const options: Plane[] = []

    for (let i = 0; i < numberOfOptions; i++) {
      const randomIndex = Math.floor(Math.random() * prototypes.length)
      const manufactureTime = Clock.getInstance().playtime - Math.floor(Math.random() * Timeframes.YEAR * 20)

      const prototype = prototypes[randomIndex]

      options.push(new Plane(
        prototype.familyName,
        prototype.typeName,
        prototype.maxSeating,
        prototype.MTOW,
        prototype.maxRange,
        prototype.maxFuel,
        prototype.cruiseSpeed,
        prototype.fuelConsumption,
        calculatePricing(prototype, manufactureTime),
        `${getRandomCharacters(2)}-${getRandomCharacters(4, true)}`,
        manufactureTime
      ))
    }

    return options
  }

  public static getInstance (): MarketController {
    if (MarketController.instance === undefined) {
      MarketController.instance = new MarketController()
    }

    return MarketController.instance
  }
}
