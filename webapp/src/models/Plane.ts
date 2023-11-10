export type PlaneTuple = [
  familyName: string,
  subtypeName: string,
  maxSeating: { economy: number, business: number, first: number },
  MTOW: number,
  maxRange: number,
  maxFuel: number,
  cruiseSpeed: number,
  fuelConsumption: number,
  pricing: { purchase: number, lease: number, downpayment: number, maintenance: number },
  registration: string,
  manufacturedWeek: number
]

export const convertToPlaneTuple = (plane: Plane): PlaneTuple => {
  return [
    plane.familyName,
    plane.subtypeName,
    plane.maxSeating,
    plane.MTOW,
    plane.maxRange,
    plane.maxFuel,
    plane.cruiseSpeed,
    plane.fuelConsumption,
    plane.pricing,
    plane.registration,
    plane.manufacturedWeek
  ]
}

export const PlanesData: PlaneTuple[] = [
  ['Airbus', 'A320', { economy: 164, business: 0, first: 0 }, 78000, 6100, 27000, 830, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Airbus', 'A330', { economy: 277, business: 0, first: 0 }, 242000, 13400, 139000, 870, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Airbus', 'A340', { economy: 295, business: 0, first: 0 }, 276500, 13400, 139000, 870, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Airbus', 'A350', { economy: 366, business: 0, first: 0 }, 268000, 15000, 138000, 900, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Airbus', 'A380', { economy: 555, business: 0, first: 0 }, 575000, 15200, 320000, 903, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Boeing', '737', { economy: 189, business: 0, first: 0 }, 79000, 5600, 26000, 830, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Boeing', '747', { economy: 467, business: 0, first: 0 }, 396890, 14815, 216840, 920, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Boeing', '757', { economy: 239, business: 0, first: 0 }, 115680, 7222, 43000, 850, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Boeing', '767', { economy: 375, business: 0, first: 0 }, 186880, 11000, 91000, 850, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Boeing', '777', { economy: 451, business: 0, first: 0 }, 297560, 11000, 181280, 905, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Boeing', '787', { economy: 381, business: 0, first: 0 }, 227930, 15700, 126200, 903, 6000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Bombardier', 'CRJ', { economy: 50, business: 0, first: 0 }, 36287, 3710, 11000, 780, 1000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Bombardier', 'CSeries', { economy: 133, business: 0, first: 0 }, 60000, 5900, 19000, 828, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Embraer', 'ERJ', { economy: 50, business: 0, first: 0 }, 37000, 3334, 11000, 828, 1000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Embraer', 'E-Jet', { economy: 124, business: 0, first: 0 }, 50000, 3334, 15000, 828, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['McDonnell Douglas', 'MD-11', { economy: 410, business: 0, first: 0 }, 286000, 12400, 171000, 890, 6000, { purchase: 100000000, downpayment: 400000, lease: 50000, maintenance: 10000 }, '', 0],
  ['McDonnell Douglas', 'MD-80', { economy: 172, business: 0, first: 0 }, 75000, 3334, 19000, 828, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['McDonnell Douglas', 'MD-90', { economy: 172, business: 0, first: 0 }, 75000, 3334, 19000, 828, 2500, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Bombardier', 'Dash 8', { economy: 90, business: 0, first: 0 }, 17500, 2130, 6000, 667, 1000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0],
  ['Bombardier', 'Q400', { economy: 90, business: 0, first: 0 }, 28600, 2130, 11000, 667, 1000, { purchase: 100000000, lease: 50000, downpayment: 400000, maintenance: 10000 }, '', 0]
]

export class Plane {
  constructor (
    public readonly familyName: string,
    public readonly subtypeName: string,
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
      downpayment: number
      maintenance: number
    },
    public readonly registration: string,
    public readonly manufacturedWeek: number
  ) {}

  introduce (): string {
    return (`Plane: ${this.familyName} ${this.subtypeName}`)
  }

  getIdentification (): string {
    return (`${this.familyName}-${this.subtypeName}`)
  }

  getPricing (): {
    purchase: string
    lease: string
    downpayment: string
    maintenance: string
  } {
    return {
      purchase: this.pricing.purchase.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      lease: this.pricing.lease.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      downpayment: this.pricing.downpayment.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      maintenance: this.pricing.maintenance.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    }
  }
}
