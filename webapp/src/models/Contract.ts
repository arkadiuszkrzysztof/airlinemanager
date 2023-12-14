import { Clock } from '../controllers/helpers/Clock'
import { type Airport } from './Airport'

export type ContractTuple = [
  id: string,
  hub: Airport,
  destination: Airport,
  distance: number,
  departureTime: number,
  contractDuration: number,
  demand: {
    economy: number
    business: number
    first: number
  },
  accepted: boolean,
  startTime: number,
  expirationTime: number,
  reputation: number
]

export const convertToContractTuple = (contract: Contract): ContractTuple => {
  return [
    contract.id,
    contract.hub,
    contract.destination,
    contract.distance,
    contract.departureTime,
    contract.contractDuration,
    contract.demand,
    contract.accepted,
    contract.startTime,
    contract.expirationTime,
    contract.reputation
  ]
}

export class Contract {
  constructor (
    public readonly id: string,
    public readonly hub: Airport,
    public readonly destination: Airport,
    public readonly distance: number,
    public readonly departureTime: number,
    public readonly contractDuration: number,
    public readonly demand: { economy: number, business: number, first: number },
    public accepted: boolean = false,
    public startTime: number = 0,
    public expirationTime: number = 0,
    public readonly reputation: number = 0
  ) {}

  public accept (): void {
    this.accepted = true
    this.startTime = Clock.getInstance().tomorrowStartPlaytime
    this.expirationTime = this.startTime + this.contractDuration
  }
}
