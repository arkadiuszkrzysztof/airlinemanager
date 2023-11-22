import { type Plane } from '../models/Plane'
import { Clock } from './helpers/Clock'
import { type HangarAsset, HangarController } from './HangarController'
import { LocalStorage } from './helpers/LocalStorage'
import { type Schedule } from './ScheduleController'
import { formatCashValue } from './helpers/Helpers'

export enum Tier { Bronze = 'Bronze', Silver = 'Silver', Gold = 'Gold', Platinum = 'Platinum' }
interface TierRecord {
  minReputation: number
  constraints: {
    MTOW: number
    maxPlanes: number
    reputationGain: number
  }
  perks: {
    hubDiscount: number
    destinationDiscount: number
    marketDiscount: number
  }
}

export interface PNLRecord {
  statistics: {
    numberOfFlights: number
    numberOfPlanes: number
    totalPassengers: number
  }
  revenue: {
    economy: number
    business: number
    first: number
    selling: number
  }
  expenses: {
    fuel: number
    maintenance: number
    leasing: number
    landing: number
    passenger: number
    purchasing: number
    downpayment: number
    cancellationFee: number
  }
}

const Tiers: Record<Tier, TierRecord> = {
  [Tier.Platinum]: {
    minReputation: 75,
    constraints: {
      MTOW: 750,
      maxPlanes: 25,
      reputationGain: 0.2
    },
    perks: {
      hubDiscount: 0.4,
      destinationDiscount: 0.2,
      marketDiscount: 0.2
    }
  },
  [Tier.Gold]: {
    minReputation: 50,
    constraints: {
      MTOW: 500,
      maxPlanes: 15,
      reputationGain: 0.4
    },
    perks: {
      hubDiscount: 0.3,
      destinationDiscount: 0.1,
      marketDiscount: 0.1
    }
  },
  [Tier.Silver]: {
    minReputation: 25,
    constraints: {
      MTOW: 300,
      maxPlanes: 10,
      reputationGain: 0.7
    },
    perks: {
      hubDiscount: 0.2,
      destinationDiscount: 0.1,
      marketDiscount: 0.05
    }
  },
  [Tier.Bronze]: {
    minReputation: 0,
    constraints: {
      MTOW: 50,
      maxPlanes: 3,
      reputationGain: 1
    },
    perks: {
      hubDiscount: 0.1,
      destinationDiscount: 0.05,
      marketDiscount: 0
    }
  }
}

export enum EventOrigin { AIRLINE = 'Airline', MARKET = 'Market', CONTRACT = 'Contract', SCHEDULE = 'Schedule', HANGAR = 'Hangar' }

export class AirlineController {
  private static instance: AirlineController

  private readonly _name: string
  private _reputation: number
  private _cash: number
  private readonly _pnl: Record<number, PNLRecord>
  private readonly _eventLog: Array<{ playtime: number, origin: EventOrigin, message: string }>

  private constructor () {
    this._name = LocalStorage.getAirlineName()
    this._reputation = LocalStorage.getReputation()
    this._cash = LocalStorage.getCash()
    this._pnl = LocalStorage.getPNL()
    this._eventLog = LocalStorage.getEventLog()
  }

  public static getInstance (): AirlineController {
    if (AirlineController.instance === undefined) {
      AirlineController.instance = new AirlineController()
    }

    return AirlineController.instance
  }

  public getTier (): { name: Tier, record: TierRecord } {
    let currentTier: { name: Tier, record: TierRecord }

    if (this._reputation >= 75) {
      currentTier = { name: Tier.Platinum, record: Tiers[Tier.Platinum] }
    } else if (this._reputation >= 50) {
      currentTier = { name: Tier.Gold, record: Tiers[Tier.Gold] }
    } else if (this._reputation >= 25) {
      currentTier = { name: Tier.Silver, record: Tiers[Tier.Silver] }
    } else {
      currentTier = { name: Tier.Bronze, record: Tiers[Tier.Bronze] }
    }

    return currentTier
  }

  public getNextTier (): { name: Tier, record: TierRecord } | undefined {
    let nextTier: { name: Tier, record: TierRecord } | undefined

    if (this._reputation >= 75) {
      nextTier = undefined
    } else if (this._reputation >= 50) {
      nextTier = { name: Tier.Platinum, record: Tiers[Tier.Platinum] }
    } else if (this._reputation >= 25) {
      nextTier = { name: Tier.Gold, record: Tiers[Tier.Gold] }
    } else {
      nextTier = { name: Tier.Silver, record: Tiers[Tier.Silver] }
    }

    return nextTier
  }

  public gainReputation (amount: number): void {
    this._reputation += amount
    LocalStorage.setReputation(this._reputation)
  }

  public loseReputation (amount: number): void {
    this._reputation -= amount
    LocalStorage.setReputation(this._reputation)
  }

  public gainCash (amount: number): void {
    this._cash += amount
    LocalStorage.setCash(this._cash)
  }

  public spendCash (amount: number): void {
    this._cash -= amount
    LocalStorage.setCash(this._cash)
  }

  get reputation (): string {
    return (this._reputation / 100).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 })
  }

  get cash (): string {
    return this._cash.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  }

  get name (): string {
    return this._name
  }

  public buyPlane (plane: Plane): void {
    if (this._cash < plane.pricing.purchase) {
      return
    }

    this.settlePlanePurchase(plane)

    plane.acquisitionTime = Clock.getInstance().timeThisDayStart
    HangarController.getInstance().addAsset({ plane, ownership: 'owned' })
  }

  public sellPlane (asset: HangarAsset): void {
    this.settlePlaneSale(asset.plane)

    HangarController.getInstance().removeAsset(asset)
  }

  public leasePlane (plane: Plane): void {
    if (this._cash < plane.pricing.leaseDownpayment) {
      return
    }

    this.settlePlaneLease(plane)

    plane.acquisitionTime = Clock.getInstance().timeThisDayStart
    plane.leaseExpirationTime = plane.acquisitionTime + plane.pricing.leaseDuration
    HangarController.getInstance().addAsset({ plane, ownership: 'leased' })
  }

  public cancelLease (asset: HangarAsset): void {
    if (this._cash < asset.plane.pricing.leaseCancellationFee) {
      return
    }

    this.settlePlaneLeaseCancellation(asset.plane)

    HangarController.getInstance().removeAsset(asset)
  }

  public logEvent (origin: EventOrigin, message: string): void {
    this._eventLog.push({ playtime: Clock.getInstance().playtime, origin, message })
    LocalStorage.setEventLog(this._eventLog)
  }

  private getThisMonthPNLRecord (): PNLRecord {
    const timeThisMonthStart = Clock.getInstance().timeThisMonthStart

    this._pnl[timeThisMonthStart] = this._pnl[timeThisMonthStart] ??
      { statistics: { numberOfFlights: 0, numberOfPlanes: 0, totalPassengers: 0 }, revenue: { economy: 0, business: 0, first: 0, selling: 0 }, expenses: { fuel: 0, maintenance: 0, leasing: 0, landing: 0, passenger: 0, purchasing: 0, downpayment: 0, cancellationFee: 0 } }

    return this._pnl[timeThisMonthStart]
  }

  public settlePlaneLease (plane: Plane): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfPlanes += 1
    thisMonthPNL.expenses.downpayment += plane.pricing.leaseDownpayment

    LocalStorage.setPNL(this._pnl)

    this.logEvent(EventOrigin.MARKET, `Leased ${plane.familyName} ${plane.typeName} (${plane.registration}) for ${plane.getLeaseDuration()} with ${formatCashValue(plane.pricing.leaseDownpayment)} downpayment`)

    this.spendCash(plane.pricing.leaseDownpayment)
  }

  public settlePlaneLeaseCancellation (plane: Plane): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfPlanes -= 1
    thisMonthPNL.expenses.cancellationFee += plane.pricing.leaseCancellationFee

    LocalStorage.setPNL(this._pnl)

    this.logEvent(EventOrigin.MARKET, `Cancelled lease for ${plane.familyName} ${plane.typeName} (${plane.registration}) with ${formatCashValue(plane.pricing.leaseCancellationFee)} early cancellation fee`)

    this.spendCash(plane.pricing.leaseCancellationFee)
  }

  public settlePlanePurchase (plane: Plane): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfPlanes += 1
    thisMonthPNL.expenses.purchasing += plane.pricing.purchase

    LocalStorage.setPNL(this._pnl)

    this.logEvent(EventOrigin.MARKET, `Purchased ${plane.familyName} ${plane.typeName} (${plane.registration}) for ${formatCashValue(plane.pricing.purchase)}`)

    this.spendCash(plane.pricing.purchase)
  }

  public settlePlaneSale (plane: Plane): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfPlanes -= 1
    thisMonthPNL.revenue.selling += plane.getSellPrice()

    LocalStorage.setPNL(this._pnl)

    this.logEvent(EventOrigin.MARKET, `Sold ${plane.familyName} ${plane.typeName} (${plane.registration}) for ${formatCashValue(plane.getSellPrice())}`)

    this.gainCash(plane.getSellPrice())
  }

  public settleFlight (schedule: Schedule): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfFlights += 1
    thisMonthPNL.statistics.totalPassengers += schedule.option.numberOfPassengers

    thisMonthPNL.revenue.economy += schedule.option.revenue.economy
    thisMonthPNL.revenue.business += schedule.option.revenue.business
    thisMonthPNL.revenue.first += schedule.option.revenue.first

    thisMonthPNL.expenses.fuel += schedule.option.cost.fuel
    thisMonthPNL.expenses.maintenance += schedule.option.cost.maintenance
    thisMonthPNL.expenses.landing += schedule.option.cost.landing
    thisMonthPNL.expenses.passenger += schedule.option.cost.passenger
    thisMonthPNL.expenses.leasing += schedule.option.cost.leasing

    LocalStorage.setPNL(this._pnl)

    this.gainCash(schedule.option.profit)
  }
}
