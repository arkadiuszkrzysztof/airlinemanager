import { type DaysOfWeek } from '../controllers/Clock'
import { type Airport } from './Airport'

export type ContractTuple = [
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
  }
]

export const convertToContractTuple = (contract: Contract): ContractTuple => {
  return [
    contract.hub,
    contract.destination,
    contract.distance,
    contract.dayOfWeek,
    contract.departureTime,
    contract.contractDuration,
    contract.demand
  ]
}

export class Contract {
  public readonly hub: Airport
  public readonly destination: Airport
  public readonly distance: number
  public readonly dayOfWeek: DaysOfWeek
  public readonly departureTime: string
  public readonly contractDuration: number
  public readonly demand: {
    economy: number
    business: number
    first: number
  }

  constructor (hub: Airport, destination: Airport, distance: number, dayOfWeek: DaysOfWeek, departureTime: string, contractDuration: number, demand: { economy: number, business: number, first: number }) {
    this.hub = hub
    this.destination = destination
    this.distance = distance
    this.dayOfWeek = dayOfWeek
    this.departureTime = departureTime
    this.contractDuration = contractDuration
    this.demand = demand
  }
}
