import { Clock, type DaysOfWeek } from '../controllers/helpers/Clock'
import { type Airport } from './Airport'

export type ContractTuple = [
  id: string,
  hub: Airport,
  destination: Airport,
  distance: number,
  dayOfWeek: DaysOfWeek,
  departureTime: string,
  contractDuration: number,
  demand: {
    economy: number
    business: number
    first: number
  },
  accepted: boolean,
  startTime: number,
  expirationTime: number
]

export const convertToContractTuple = (contract: Contract): ContractTuple => {
  return [
    contract.id,
    contract.hub,
    contract.destination,
    contract.distance,
    contract.dayOfWeek,
    contract.departureTime,
    contract.contractDuration,
    contract.demand,
    contract.accepted,
    contract.startTime,
    contract.expirationTime
  ]
}

export class Contract {
  constructor (
    public readonly id: string,
    public readonly hub: Airport,
    public readonly destination: Airport,
    public readonly distance: number,
    public readonly dayOfWeek: DaysOfWeek,
    public readonly departureTime: string,
    public readonly contractDuration: number,
    public readonly demand: { economy: number, business: number, first: number },
    public accepted: boolean = false,
    public startTime: number = 0,
    public expirationTime: number = 0
  ) {}

  public accept (): void {
    this.accepted = true
    this.startTime = Clock.getTimeClosestDayStart(this.dayOfWeek)
    this.expirationTime = this.startTime + this.contractDuration
  }
}
