import { type Plane } from '../models/Plane'
import { GameController } from './GameController'
import { type HangarAsset, HangarController } from './HangarController'
import { LocalStorage } from './LocalStorage'

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

export class AirlineController {
  private static instance: AirlineController

  private readonly _name: string
  private _reputation: number
  private _cash: number

  private constructor () {
    this._name = LocalStorage.getAirlineName()
    this._reputation = LocalStorage.getReputation()
    this._cash = LocalStorage.getCash()
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
      GameController.displayMessage('Not enough cash!')
      return
    }
    const hangarController = HangarController.getInstance()
    this.spendCash(plane.pricing.purchase)
    hangarController.addAsset({ plane, ownership: 'owned' })
  }

  public sellPlane (asset: HangarAsset): void {
    this.gainCash(asset.plane.getSellPrice())
    HangarController.getInstance().removeAsset(asset)
  }

  public leasePlane (plane: Plane): void {
    if (this._cash < plane.pricing.leaseDownpayment) {
      GameController.displayMessage('Not enough cash!')
      return
    }
    const hangarController = HangarController.getInstance()
    this.spendCash(plane.pricing.leaseDownpayment)
    hangarController.addAsset({ plane, ownership: 'leased' })
  }

  public cancelLease (asset: HangarAsset): void {
    if (this._cash < asset.plane.pricing.leaseCancelationFee) {
      GameController.displayMessage('Not enough cash!')
      return
    }
    this.spendCash(asset.plane.pricing.leaseCancelationFee)
    HangarController.getInstance().removeAsset(asset)
  }
}
