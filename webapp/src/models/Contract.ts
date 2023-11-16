import { type DaysOfWeek } from '../controllers/Clock'
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
  }
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
    contract.demand
  ]
}

export class Contract {
  public readonly id: string
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

  constructor (id: string, hub: Airport, destination: Airport, distance: number, dayOfWeek: DaysOfWeek, departureTime: string, contractDuration: number, demand: { economy: number, business: number, first: number }) {
    this.id = id
    this.hub = hub
    this.destination = destination
    this.distance = distance
    this.dayOfWeek = dayOfWeek
    this.departureTime = departureTime
    this.contractDuration = contractDuration
    this.demand = demand
  }
}
