enum Tier { Bronze = 'Bronze', Silver = 'Silver', Gold = 'Gold', Platinum = 'Platinum' }
type TierRecord = Record<string, { minReputation: number, constraints: { MTOW: number | null } }>

export class AirlineController {
  private static instance: AirlineController

  private readonly _name: string
  private _reputation: number
  private _cash: number

  private constructor () {
    this._name = '### YOUR NAME HERE ###'
    this._reputation = 2.55
    this._cash = 250000000
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
  }

  public loseReputation (amount: number): void {
    this._reputation -= amount
  }

  public gainCash (amount: number): void {
    this._cash += amount
  }

  public spendCash (amount: number): void {
    this._cash -= amount
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
}
