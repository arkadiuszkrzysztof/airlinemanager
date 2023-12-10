import { Autobind } from './helpers/Autobind'
import { Plane, PlanesData } from '../models/Plane'
import { AirlineController } from './AirlineController'
import { Clock, Timeframes } from './helpers/Clock'
import { LocalStorage } from './helpers/LocalStorage'
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

    if (lastRefresh === -1 || playtime - lastRefresh >= Timeframes.WEEK) {
      const newOffers = this.generatePlaneOptions()
      LocalStorage.setMarketOffers(newOffers)
      LocalStorage.setLastMarketRefresh(playtime - playtime % Timeframes.WEEK)
      this.callListeners(newOffers)
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
    const calculatePricing = ({ pricing }: Plane, manufactureTime: number): { purchase: number, lease: number, leaseDuration: number, leaseCancellationFee: number, leaseDownpayment: number, maintenance: number } => {
      const age = Math.round((Clock.getInstance().playtime - manufactureTime) / Timeframes.YEAR)

      const tier = this.AirlineController.getTier().record

      return {
        purchase: getDepreciation(pricing.purchase, age) * (1 - tier.perks.marketDiscount),
        lease: (pricing.lease * (1 - age * 2 / 100)) * (1 - tier.perks.marketDiscount),
        leaseDuration: Timeframes.MONTH * Math.floor(Math.random() * 60 + 36),
        leaseCancellationFee: (pricing.leaseCancellationFee * (1 - age * 2 / 100)) * (1 - tier.perks.marketDiscount),
        leaseDownpayment: (pricing.leaseDownpayment * (1 - age * 2 / 100)) * (1 - tier.perks.marketDiscount),
        maintenance: age > 5 ? pricing.maintenance * (1 + age * 2 / 100) : pricing.maintenance
      }
    }

    const getReputationDepreciated = (plane: Plane, manufactureTime: number): number => {
      const ageInYears = (Clock.getInstance().playtime - manufactureTime) / Timeframes.YEAR

      return Math.floor(plane.reputation * 100 * (1 - (ageInYears * 2 / 100))) / 100
    }

    const tier = this.AirlineController.getTier()
    const constraints = tier.record.constraints

    const prototypes = this.planes.filter(plane => constraints.MTOW != null ? plane.MTOW <= constraints.MTOW : true)

    const numberOfOptions = prototypes.length * 3
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
        manufactureTime,
        getReputationDepreciated(prototype, manufactureTime)
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
