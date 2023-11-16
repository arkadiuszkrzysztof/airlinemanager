import { Clock, Timeframes } from '../controllers/Clock'
import { type Airport } from './Airport'

export type PlaneTuple = [
  familyName: string,
  typeName: string,
  maxSeating: { economy: number, business: number, first: number },
  MTOW: number,
  maxRange: number,
  maxFuel: number,
  cruiseSpeed: number,
  fuelConsumption: number,
  pricing: { purchase: number, lease: number, leaseDuration: number, leaseCancelationFee: number, leaseDownpayment: number, maintenance: number },
  registration: string,
  manufactureTime: number,
  hub?: Airport
]

export const convertToPlaneTuple = (plane: Plane): PlaneTuple => {
  return [
    plane.familyName,
    plane.typeName,
    plane.maxSeating,
    plane.MTOW,
    plane.maxRange,
    plane.maxFuel,
    plane.cruiseSpeed,
    plane.fuelConsumption,
    plane.pricing,
    plane.registration,
    plane.manufactureTime,
    plane.hub
  ]
}

export const PlanesData: PlaneTuple[] = [
  ['Airbus', 'A320', { economy: 164, business: 0, first: 0 }, 78, 6100, 27000, 829, 3125, { purchase: 98000000, lease: 2200, leaseDuration: 0, leaseCancelationFee: 390000 * 3, leaseDownpayment: 390000, maintenance: 800 }, '', 0],
  ['Boeing', '787', { economy: 266, business: 24, first: 0 }, 252, 14140, 138700, 903, 5400, { purchase: 239000000, lease: 4500, leaseDuration: 0, leaseCancelationFee: 820000 * 3, leaseDownpayment: 820000, maintenance: 1500 }, '', 0],
  ['Embraer', 'E170', { economy: 72, business: 0, first: 0 }, 39, 3900, 9300, 797, 1750, { purchase: 46000000, lease: 1050, leaseDuration: 0, leaseCancelationFee: 175000 * 3, leaseDownpayment: 175000, maintenance: 500 }, '', 0]
  // ['Airbus', 'A330', { economy: 277, business: 0, first: 0 }, 242000, 13400, 139000, 870, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Airbus', 'A340', { economy: 295, business: 0, first: 0 }, 276500, 13400, 139000, 870, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Airbus', 'A350', { economy: 366, business: 0, first: 0 }, 268000, 15000, 138000, 900, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Airbus', 'A380', { economy: 555, business: 0, first: 0 }, 575000, 15200, 320000, 903, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Boeing', '737', { economy: 189, business: 0, first: 0 }, 79000, 5600, 26000, 830, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Boeing', '747', { economy: 467, business: 0, first: 0 }, 396890, 14815, 216840, 920, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Boeing', '757', { economy: 239, business: 0, first: 0 }, 115680, 7222, 43000, 850, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Boeing', '767', { economy: 375, business: 0, first: 0 }, 186880, 11000, 91000, 850, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Boeing', '777', { economy: 451, business: 0, first: 0 }, 297560, 11000, 181280, 905, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Bombardier', 'CRJ', { economy: 50, business: 0, first: 0 }, 36287, 3710, 11000, 780, 1000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Bombardier', 'CSeries', { economy: 133, business: 0, first: 0 }, 60000, 5900, 19000, 828, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Embraer', 'E-Jet', { economy: 124, business: 0, first: 0 }, 50000, 3334, 15000, 828, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['McDonnell Douglas', 'MD-11', { economy: 410, business: 0, first: 0 }, 286000, 12400, 171000, 890, 6000, { purchase: 100000000, downpayment: 400000, lease: 50000, maintenance: 10000 }, '', 0],
  // ['McDonnell Douglas', 'MD-80', { economy: 172, business: 0, first: 0 }, 75000, 3334, 19000, 828, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['McDonnell Douglas', 'MD-90', { economy: 172, business: 0, first: 0 }, 75000, 3334, 19000, 828, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Bombardier', 'Dash 8', { economy: 90, business: 0, first: 0 }, 17500, 2130, 6000, 667, 1000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  // ['Bombardier', 'Q400', { economy: 90, business: 0, first: 0 }, 28600, 2130, 11000, 667, 1000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0]
]

export class Plane {
  constructor (
    public readonly familyName: string,
    public readonly typeName: string,
    public readonly maxSeating: {
      economy: number
      business: number
      first: number
    },
    public readonly MTOW: number,
    public readonly maxRange: number,
    public readonly maxFuel: number,
    public readonly cruiseSpeed: number,
    public readonly fuelConsumption: number,
    public readonly pricing: {
      purchase: number
      lease: number
      leaseDuration: number
      leaseCancelationFee: number
      leaseDownpayment: number
      maintenance: number
    },
    public readonly registration: string,
    public readonly manufactureTime: number,
    public hub?: Airport
  ) {}

  getPricing (): {
    purchase: string
    lease: string
    leaseDuration: string
    leaseCancellationFee: string
    leaseDownpayment: string
    maintenance: string
  } {
    return {
      purchase: this.pricing.purchase.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      lease: this.pricing.lease.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      leaseDuration: `${Math.floor(this.pricing.leaseDuration / Timeframes.MONTH)} months`,
      leaseCancellationFee: this.pricing.leaseCancelationFee.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      leaseDownpayment: this.pricing.leaseDownpayment.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      maintenance: this.pricing.maintenance.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    }
  }

  setHub (hub: Airport): void {
    this.hub = hub
  }

  private formatPlaytimeInYearsAndMonths (playtime: number): string {
    const years = Math.floor(playtime / Timeframes.YEAR)
    const months = Math.floor((playtime % Timeframes.YEAR) / Timeframes.MONTH)
    return (years > 0 ? `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'}` : `${months} ${months === 1 ? 'month' : 'months'}`)
  }

  getAge (): string {
    const age = Clock.getInstance().playtime - this.manufactureTime

    return this.formatPlaytimeInYearsAndMonths(age)
  }

  getLeaseDuration (): string {
    return this.formatPlaytimeInYearsAndMonths(this.pricing.leaseDuration)
  }
}
