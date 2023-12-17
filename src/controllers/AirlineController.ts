import { type Plane } from '../models/Plane'
import { Clock } from './helpers/Clock'
import { type HangarAsset, HangarController } from './HangarController'
import { LocalStorage } from './helpers/LocalStorage'
import { type Schedule } from './ScheduleController'
import { formatCashValue } from './helpers/Helpers'
import { Tier, type TierRecord, Tiers } from './helpers/Tiers'
import { type Achievement, AchievementType, MissionController, type Mission } from './MissionController'
import { Regions } from '../models/Airport'

export interface PNLRecord {
  statistics: {
    numberOfFlights: number
    numberOfPlanes: number
    totalDistance: number
    visitedRegions: Record<keyof typeof Regions, number>
    totalPassengers: {
      economy: number
      business: number
      first: number
    }
  }
  revenue: {
    economy: number
    business: number
    first: number
    selling: number
    missions: number
  }
  costs: {
    fuel: number
    maintenance: number
    leasing: number
    landing: number
    passenger: number
    purchasing: number
    downpayment: number
    cancellationFee: number
    unlockingRegions: number
  }
}

export type EventLogRecords = Array<{ playtime: number, origin: EventOrigin, message: string }>

export enum EventOrigin { AIRLINE = 'Airline', MARKET = 'Market', CONTRACT = 'Contract', SCHEDULE = 'Schedule', HANGAR = 'Hangar', MISSIONS = 'Missions' }

export enum ReputationType { FLEET = 'Fleet', CONNECTION = 'Connection', REGION = 'Region' }
export class AirlineController {
  private static instance: AirlineController
  private readonly pnlListeners: Record<string, (pnl: Record<number, PNLRecord>) => void> = {}

  private readonly _name: string
  private readonly _startingRegion: string
  private readonly _unlockedRegions: string[]
  private _reputation: Array<{ originId: string, type: ReputationType, reputation: number }>
  private _cash: number
  private readonly _pnl: Record<number, PNLRecord>
  private readonly _eventLog: EventLogRecords

  private constructor () {
    this._name = LocalStorage.getAirlineName()
    this._startingRegion = LocalStorage.getStartingRegion()
    this._unlockedRegions = LocalStorage.getUnlockedRegions()
    this._reputation = LocalStorage.getReputation()
    this._cash = LocalStorage.getCash()
    this._pnl = LocalStorage.getPNL()
    this._eventLog = LocalStorage.getEventLog()
  }

  public registerPNLListener (key: string, listener: (pnl: Record<number, PNLRecord>) => void): void {
    this.pnlListeners[key] = listener
  }

  private callPNLListeners (pnl: Record<number, PNLRecord>): void {
    Object.values(this.pnlListeners).forEach(listener => { listener(pnl) })
  }

  public static getInstance (): AirlineController {
    if (AirlineController.instance === undefined) {
      AirlineController.instance = new AirlineController()
    }

    return AirlineController.instance
  }

  public getTier (): { name: Tier, record: TierRecord } {
    let currentTier: { name: Tier, record: TierRecord }

    if (this.reputation.totalCapped >= 90) {
      currentTier = { name: Tier.PLATINUM, record: Tiers[Tier.PLATINUM] }
    } else if (this.reputation.totalCapped >= 50) {
      currentTier = { name: Tier.GOLD, record: Tiers[Tier.GOLD] }
    } else if (this.reputation.totalCapped >= 25) {
      currentTier = { name: Tier.SILVER, record: Tiers[Tier.SILVER] }
    } else {
      currentTier = { name: Tier.BRONZE, record: Tiers[Tier.BRONZE] }
    }

    return currentTier
  }

  public getNextTier (): { name: Tier, record: TierRecord } | undefined {
    let nextTier: { name: Tier, record: TierRecord } | undefined

    if (this.reputation.totalCapped >= 90) {
      nextTier = undefined
    } else if (this.reputation.totalCapped >= 50) {
      nextTier = { name: Tier.PLATINUM, record: Tiers[Tier.PLATINUM] }
    } else if (this.reputation.totalCapped >= 25) {
      nextTier = { name: Tier.GOLD, record: Tiers[Tier.GOLD] }
    } else {
      nextTier = { name: Tier.SILVER, record: Tiers[Tier.SILVER] }
    }

    return nextTier
  }

  public gainReputation (originId: string, type: ReputationType, reputation: number): void {
    this._reputation.push({ originId, type, reputation })
    LocalStorage.setReputation(this._reputation)
  }

  public loseReputation (originId: string): void {
    this._reputation = this._reputation.filter(r => r.originId !== originId)
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

  get reputation (): { fleet: number, connection: number, region: number, totalCapped: number } {
    const fleet = this._reputation.filter(r => r.type === ReputationType.FLEET).reduce((sum, r) => sum + r.reputation, 0)
    const connection = this._reputation.filter(r => r.type === ReputationType.CONNECTION).reduce((sum, r) => sum + r.reputation, 0)
    const region = this._reputation.filter(r => r.type === ReputationType.REGION).reduce((sum, r) => sum + r.reputation, 0)
    const totalCapped = Math.min(fleet, 40) + Math.min(connection, 40) + Math.min(region, 20)

    return { fleet, connection, region, totalCapped }
  }

  get reputationFormatted (): string {
    return (this.reputation.totalCapped / 100).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 })
  }

  get cash (): number {
    return this._cash
  }

  get cashFormatted (): string {
    return this._cash.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  }

  get name (): string {
    return this._name
  }

  get startingRegion (): string {
    return this._startingRegion
  }

  get unlockedRegions (): string[] {
    return [this.startingRegion, ...this._unlockedRegions]
  }

  get PNL (): Record<number, PNLRecord> {
    if (Object.keys(this._pnl).length === 0) {
      this.getThisMonthPNLRecord()
    }
    return this._pnl
  }

  public unlockRegion (region: string, price: number, reputation: number): void {
    this._unlockedRegions.push(region)
    LocalStorage.setUnlockedRegions(this._unlockedRegions)

    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.costs.unlockingRegions += price

    LocalStorage.setPNL(this._pnl)

    this.gainReputation(region, ReputationType.REGION, reputation)

    this.logEvent(EventOrigin.MISSIONS, `Unlocked ${Regions[region as keyof typeof Regions]} region for ${formatCashValue(price)}`)

    this.spendCash(price)
  }

  public buyPlane (plane: Plane): void {
    if (this._cash < plane.pricing.purchase) {
      return
    }

    this.settlePlanePurchase(plane)

    plane.acquisitionTime = Clock.getInstance().timeThisDayStart
    HangarController.getInstance().addAsset({ plane, ownership: 'owned' })

    MissionController.getInstance().notifyAchievements(AchievementType.FLEET_SIZE)
    MissionController.getInstance().notifyAchievements(AchievementType.REPUTATION)
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

    MissionController.getInstance().notifyAchievements(AchievementType.FLEET_SIZE)
    MissionController.getInstance().notifyAchievements(AchievementType.REPUTATION)
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

  public getEventLog (): EventLogRecords {
    return this._eventLog
  }

  private getThisMonthPNLRecord (): PNLRecord {
    const timeThisMonthStart = Clock.getInstance().timeThisMonthStart

    this._pnl[timeThisMonthStart] = this._pnl[timeThisMonthStart] ??
      {
        statistics: { numberOfFlights: 0, numberOfPlanes: 0, totalDistance: 0, visitedRegions: { NA: 0, EU: 0, ASIA: 0, LATAM: 0, AFRICA: 0, OCEANIA: 0 }, totalPassengers: { economy: 0, business: 0, first: 0 } },
        revenue: { economy: 0, business: 0, first: 0, selling: 0, missions: 0 },
        costs: { fuel: 0, maintenance: 0, leasing: 0, landing: 0, passenger: 0, purchasing: 0, downpayment: 0, cancellationFee: 0, unlockingRegions: 0 }
      } satisfies PNLRecord

    return this._pnl[timeThisMonthStart]
  }

  public settlePlaneLease (plane: Plane): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfPlanes += 1
    thisMonthPNL.costs.downpayment += plane.pricing.leaseDownpayment

    LocalStorage.setPNL(this._pnl)

    this.callPNLListeners(this._pnl)

    this.gainReputation(plane.registration, ReputationType.FLEET, plane.reputation)

    this.logEvent(EventOrigin.MARKET, `Leased ${plane.familyName} ${plane.typeName} (${plane.registration}) for ${plane.leaseDuration} with ${formatCashValue(plane.pricing.leaseDownpayment)} downpayment`)

    this.spendCash(plane.pricing.leaseDownpayment)
  }

  public settlePlaneLeaseCancellation (plane: Plane): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfPlanes -= 1
    thisMonthPNL.costs.cancellationFee += plane.pricing.leaseCancellationFee

    LocalStorage.setPNL(this._pnl)

    this.callPNLListeners(this._pnl)

    this.loseReputation(plane.registration)

    this.logEvent(EventOrigin.MARKET, `Cancelled lease for ${plane.familyName} ${plane.typeName} (${plane.registration}) with ${formatCashValue(plane.pricing.leaseCancellationFee)} early cancellation fee`)

    this.spendCash(plane.pricing.leaseCancellationFee)
  }

  public settlePlanePurchase (plane: Plane): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfPlanes += 1
    thisMonthPNL.costs.purchasing += plane.pricing.purchase

    LocalStorage.setPNL(this._pnl)

    this.callPNLListeners(this._pnl)

    this.gainReputation(plane.registration, ReputationType.FLEET, plane.reputation)

    this.logEvent(EventOrigin.MARKET, `Purchased ${plane.familyName} ${plane.typeName} (${plane.registration}) for ${formatCashValue(plane.pricing.purchase)}`)

    this.spendCash(plane.pricing.purchase)
  }

  public settlePlaneSale (plane: Plane): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfPlanes -= 1
    thisMonthPNL.revenue.selling += plane.sellPrice

    LocalStorage.setPNL(this._pnl)

    this.callPNLListeners(this._pnl)

    this.loseReputation(plane.registration)

    this.logEvent(EventOrigin.MARKET, `Sold ${plane.familyName} ${plane.typeName} (${plane.registration}) for ${formatCashValue(plane.sellPrice)}`)

    this.gainCash(plane.sellPrice)
  }

  public settleFlight (schedule: Schedule): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()

    thisMonthPNL.statistics.numberOfFlights += 1
    thisMonthPNL.statistics.totalDistance += schedule.contract.distance * 2
    thisMonthPNL.statistics.visitedRegions[schedule.contract.hub.region as keyof typeof Regions] += 1
    thisMonthPNL.statistics.visitedRegions[schedule.contract.destination.region as keyof typeof Regions] += 1
    thisMonthPNL.statistics.totalPassengers.economy += schedule.option.numberOfPassengers.economy
    thisMonthPNL.statistics.totalPassengers.business += schedule.option.numberOfPassengers.business
    thisMonthPNL.statistics.totalPassengers.first += schedule.option.numberOfPassengers.first

    thisMonthPNL.revenue.economy += schedule.option.revenue.economy
    thisMonthPNL.revenue.business += schedule.option.revenue.business
    thisMonthPNL.revenue.first += schedule.option.revenue.first

    thisMonthPNL.costs.fuel += schedule.option.cost.fuel
    thisMonthPNL.costs.maintenance += schedule.option.cost.maintenance
    thisMonthPNL.costs.landing += schedule.option.cost.landing
    thisMonthPNL.costs.passenger += schedule.option.cost.passenger
    thisMonthPNL.costs.leasing += schedule.option.cost.leasing

    LocalStorage.setPNL(this._pnl)

    this.callPNLListeners(this._pnl)

    this.gainCash(schedule.option.profit)

    MissionController.getInstance().notifyAchievements(AchievementType.PROFIT)
    MissionController.getInstance().notifyAchievements(AchievementType.TOTAL_PASSENGERS)
  }

  public settleAchievement (achievement: Achievement): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()
    thisMonthPNL.revenue.missions += achievement.reward
    LocalStorage.setPNL(this._pnl)

    this.callPNLListeners(this._pnl)

    this.logEvent(EventOrigin.MISSIONS, `Earned achievement "${achievement.label}" with ${formatCashValue(achievement.reward)} reward`)

    this.gainCash(achievement.reward)
  }

  public settleMission (mission: Mission): void {
    const thisMonthPNL = this.getThisMonthPNLRecord()
    thisMonthPNL.revenue.missions += mission.reward
    LocalStorage.setPNL(this._pnl)

    this.callPNLListeners(this._pnl)

    this.logEvent(EventOrigin.MISSIONS, `Completed mission "${mission.label}" with ${formatCashValue(mission.reward)} reward`)

    this.gainCash(mission.reward)
  }

  public getTotalProfit (): number {
    return Object.values(this._pnl).reduce((sum, record) => sum + record.revenue.business + record.revenue.economy + record.revenue.first + record.revenue.selling + record.revenue.missions, 0)
  }

  public getTotalPassengers (): number {
    return Object.values(this._pnl).reduce((sum, record) => sum + record.statistics.totalPassengers.economy + record.statistics.totalPassengers.business + record.statistics.totalPassengers.first, 0)
  }
}
