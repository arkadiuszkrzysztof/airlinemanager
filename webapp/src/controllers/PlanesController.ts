import { Autobind } from '../decorators/Autobind'
import { Plane, PlanesData } from '../models/Plane'
import { AirlineController } from './AirlineController'
import { LocalStorage } from './LocalStorage'

export class PlanesController {
  private readonly planes: Plane[]
  private marketPlanes: Plane[]
  private static instance: PlanesController
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

    if (lastRefresh === 0 || playtime - lastRefresh >= 1440) {
      const newOffers = this.generatePlaneOptions()
      LocalStorage.setMarketOffers(newOffers)
      LocalStorage.setLastMarketRefresh(playtime)
      this.callListeners([...newOffers])
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
    const getRandomCharacters = (length: number): string => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      return result
    }

    const getDepreciation = (price: number, age: number): number => {
      for (let i = 1; i <= age; i++) {
        price *= (1 - (40 - i) / 500)
      }
      return price
    }

    const calculatePricing = ({ pricing }: Plane, manufacturedWeek: number): { purchase: number, lease: number, downpayment: number, maintenance: number } => {
      const age = Math.round(Math.abs(manufacturedWeek) / 52)

      return {
        purchase: getDepreciation(pricing.purchase, age),
        lease: pricing.lease * (1 - age * 2 / 100),
        downpayment: pricing.downpayment * (1 - age * 2 / 100),
        maintenance: age > 5 ? pricing.maintenance * (1 + age * 2 / 100) : pricing.maintenance
      }
    }

    const tier = this.AirlineController.getTier()
    const constraints = Object.values(tier)[0].constraints

    const prototypes = this.planes.filter(plane => constraints.MTOW != null ? plane.MTOW <= constraints.MTOW : true)

    const numberOfOptions = Math.ceil(prototypes.length / 3)
    const options: Plane[] = []

    for (let i = 0; i < numberOfOptions; i++) {
      const randomIndex = Math.floor(Math.random() * prototypes.length)
      const manufacturedWeek = Math.floor(Math.random() * 52 * 20) * (-1)

      const prototype = prototypes[randomIndex]

      options.push(new Plane(
        prototype.familyName,
        prototype.subtypeName,
        prototype.maxSeating,
        prototype.MTOW,
        prototype.maxRange,
        prototype.maxFuel,
        prototype.cruiseSpeed,
        prototype.fuelConsumption,
        calculatePricing(prototype, manufacturedWeek),
        `${getRandomCharacters(2)}-${getRandomCharacters(4)}`,
        manufacturedWeek
      ))
    }

    return options
  }

  public static getInstance (): PlanesController {
    if (PlanesController.instance === undefined) {
      PlanesController.instance = new PlanesController()
    }

    return PlanesController.instance
  }
}
