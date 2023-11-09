import { Plane, PlanesData } from '../models/Plane'
import { AirlineController } from './AirlineController'
import { LocalStorage } from './LocalStorage'

export class PlanesController {
  private readonly planes: Plane[] = []
  private static instance: PlanesController
  private readonly AirlineController = AirlineController.getInstance()

  private constructor () {
    this.planes = PlanesData.map(planeData => new Plane(...planeData))
  }

  getAllPlanes (): Plane[] {
    return this.planes
  }

  getAvailablePlanes (playtime: number): Plane[] {
    const activeOffers = LocalStorage.getMarketOffers()

    if (activeOffers.length === 0 || playtime % 1440 === 0) {
      const newOffers = this.generatePlaneOptions()
      LocalStorage.setMarketOffers(newOffers)
      return newOffers
    } else {
      return activeOffers
    }
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
