import { type Plane } from '../models/Plane'
import { GameController } from './GameController'
import { HangarController } from './HangarController'
import { LocalStorage } from './LocalStorage'

enum Tier { Bronze = 'Bronze', Silver = 'Silver', Gold = 'Gold', Platinum = 'Platinum' }
type TierRecord = Record<string, { minReputation: number, constraints: { MTOW: number | null } }>

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

  public getTier (): TierRecord {
    let currentTier: TierRecord

    if (this._reputation >= 75) {
      currentTier = { [Tier.Platinum]: { minReputation: 75, constraints: { MTOW: null } } }
    } else if (this._reputation >= 50) {
      currentTier = { [Tier.Gold]: { minReputation: 50, constraints: { MTOW: 500000 } } }
    } else if (this._reputation >= 25) {
      currentTier = { [Tier.Silver]: { minReputation: 25, constraints: { MTOW: 300000 } } }
    } else {
      currentTier = { [Tier.Bronze]: { minReputation: 0, constraints: { MTOW: 50000 } } }
    }

    return currentTier
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

  public leasePlane (plane: Plane): void {
    if (this._cash < plane.pricing.downpayment) {
      GameController.displayMessage('Not enough cash!')
      return
    }
    const hangarController = HangarController.getInstance()
    this.spendCash(plane.pricing.downpayment)
    hangarController.addAsset({ plane, ownership: 'leased' })
  }
}
