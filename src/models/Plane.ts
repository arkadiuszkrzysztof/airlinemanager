/* eslint-disable no-multi-spaces */
import { Clock, Timeframes } from '../controllers/helpers/Clock'
import { getDepreciation } from '../controllers/helpers/Helpers'
import { type Airport } from './Airport'

export type PlaneTuple = [
  familyName: string,
  typeName: string,
  maxSeating: { economy: number, business: number, first: number },
  crewCount: number,
  MTOW: number,
  minRunwayLength: number,
  maxRange: number,
  maxFuel: number,
  cruiseSpeed: number,
  fuelConsumption: number,
  pricing: { purchase: number, lease: number, leaseDuration: number, leaseCancellationFee: number, leaseDownpayment: number, maintenance: number },
  registration: string,
  manufactureTime: number,
  reputation: number,
  hub?: Airport,
  acquisitionTime?: number,
  leaseExpirationTime?: number
]

export const convertToPlaneTuple = (plane: Plane): PlaneTuple => {
  return [
    plane.familyName,
    plane.typeName,
    plane.maxSeating,
    plane.crewCount,
    plane.MTOW,
    plane.minRunwayLength,
    plane.maxRange,
    plane.maxFuel,
    plane.cruiseSpeed,
    plane.fuelConsumption,
    plane.pricing,
    plane.registration,
    plane.manufactureTime,
    plane.reputation,
    plane.hub,
    plane.acquisitionTime,
    plane.leaseExpirationTime
  ]
}

export const PlanesData: PlaneTuple[] = [
  // family, type         maxSeating                                 crew MTOW  runway  range   maxf    speed   fcon    pricing                                                                                                                                    reg man rep
  ['Embraer', 'E170',     { economy: 72, business: 0, first: 0 },    4,   39,   1600,   3900,   9300,   797,    1750,   { purchase: 46000000, lease: 1050, leaseDuration: 0, leaseCancellationFee: 175000 * 3, leaseDownpayment: 175000, maintenance: 500 },       '', 0,  1],
  ['Bombardier', 'Q400',  { economy: 82, business: 0, first: 0 },    4,   30,   1000,   2040,   6500,   556,    1250,   { purchase: 33500000, lease: 780, leaseDuration: 0, leaseCancellationFee: 130000 * 3, leaseDownpayment: 130000, maintenance: 400 },        '', 0,  1],
  ['Airbus', 'A320',      { economy: 164, business: 0, first: 0 },   6,   78,   1900,   6100,   27000,  829,    3125,   { purchase: 98000000, lease: 2200, leaseDuration: 0, leaseCancellationFee: 390000 * 3, leaseDownpayment: 390000, maintenance: 800 },       '', 0,  2],
  ['Boeing', '737',       { economy: 193, business: 0, first: 0 },   6,   88,   1800,   6100,   25800,  839,    2500,   { purchase: 129000000, lease: 3100, leaseDuration: 0, leaseCancellationFee: 515000 * 3, leaseDownpayment: 515000, maintenance: 900 },      '', 0,  2],
  ['Boeing', '787',       { economy: 266, business: 24, first: 0 },  8,   249,  2500,   14140,  138700, 903,    5400,   { purchase: 239000000, lease: 4500, leaseDuration: 0, leaseCancellationFee: 820000 * 3, leaseDownpayment: 820000, maintenance: 1500 },     '', 0,  3],
  ['Airbus', 'A330',      { economy: 210, business: 36, first: 0 },  8,   242,  2300,   13450,  139000, 871,    5625,   { purchase: 238500000, lease: 4500, leaseDuration: 0, leaseCancellationFee: 820000 * 3, leaseDownpayment: 820000, maintenance: 1500 },     '', 0,  3],
  ['Airbus', 'A350',      { economy: 315, business: 54, first: 0 },  10,  322,  2600,   16100,  158800, 903,    7250,   { purchase: 366000000, lease: 7000, leaseDuration: 0, leaseCancellationFee: 1250000 * 3, leaseDownpayment: 1250000, maintenance: 2500 },   '', 0,  4],
  ['Boeing', '777',       { economy: 304, business: 42, first: 8 },  10,  299,  2800,   11100,  171000, 892,    7690,   { purchase: 375000000, lease: 7100, leaseDuration: 0, leaseCancellationFee: 1300000 * 3, leaseDownpayment: 1300000, maintenance: 2500 },   '', 0,  4],
  ['Airbus', 'A380',      { economy: 411, business: 92, first: 16 }, 18,  575,  3000,   14800,  323000, 903,    11400,  { purchase: 445000000, lease: 10680, leaseDuration: 0, leaseCancellationFee: 1780000 * 3, leaseDownpayment: 1780000, maintenance: 3800 },  '', 0,  5],
  ['Boeing', '747',       { economy: 315, business: 78, first: 23 }, 12,  396,  3100,   13500,  205000, 933,    11200,  { purchase: 418000000, lease: 10020, leaseDuration: 0, leaseCancellationFee: 1670000 * 3, leaseDownpayment: 1670000, maintenance: 4000 },  '', 0,  5],
  ['BAC', 'Concorde',     { economy: 0, business: 72, first: 36 },   6,   185,  3600,   7200,   120000, 2158,   25600,  { purchase: 550000000, lease: 13200, leaseDuration: 0, leaseCancellationFee: 2200000 * 3, leaseDownpayment: 2200000, maintenance: 5500 },  '', 0,  7]
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
    public readonly crewCount: number,
    public readonly MTOW: number,
    public readonly minRunwayLength: number,
    public readonly maxRange: number,
    public readonly maxFuel: number,
    public readonly cruiseSpeed: number,
    public readonly fuelConsumption: number,
    public readonly pricing: {
      purchase: number
      lease: number
      leaseDuration: number
      leaseCancellationFee: number
      leaseDownpayment: number
      maintenance: number
    },
    public readonly registration: string,
    public readonly manufactureTime: number,
    public readonly reputation: number,
    public hub?: Airport,
    public acquisitionTime?: number,
    public leaseExpirationTime?: number
  ) {}

  get pricingFormatted (): {
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
      leaseCancellationFee: this.pricing.leaseCancellationFee.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      leaseDownpayment: this.pricing.leaseDownpayment.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      maintenance: this.pricing.maintenance.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    }
  }

  setHub (hub: Airport | undefined): void {
    this.hub = hub
  }

  get age (): string {
    const age = Clock.getInstance().playtime - this.manufactureTime

    return Clock.formatPlaytimeInYearsAndMonths(age)
  }

  get leaseDuration (): string {
    return Clock.formatPlaytimeInYearsAndMonths(this.pricing.leaseDuration)
  }

  get sellPrice (): number {
    const age = Math.round((Clock.getInstance().playtime - this.manufactureTime) / Timeframes.YEAR)

    return getDepreciation(this.pricing.purchase, age)
  }
}
