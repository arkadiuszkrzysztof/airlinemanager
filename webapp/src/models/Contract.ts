import { type Airport } from './Airport'

export type ContractTuple = [
  hub: Airport,
  destination: Airport,
  distance: number,
  dayOfWeek: string,
  duration: number,
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
    contract.duration,
    contract.demand
  ]
}

export class Contract {
  public readonly hub: Airport
  public readonly destination: Airport
  public readonly distance: number
  public readonly dayOfWeek: string
  public readonly duration: number
  public readonly demand: {
    economy: number
    business: number
    first: number
  }

  constructor (hub: Airport, destination: Airport, distance: number, dayOfWeek: string, duration: number, demand: { economy: number, business: number, first: number }) {
    this.hub = hub
    this.destination = destination
    this.distance = distance
    this.dayOfWeek = dayOfWeek
    this.duration = duration
    this.demand = demand
  }

  getHub (): Airport {
    return this.hub
  }

  getDestination (): Airport {
    return this.destination
  }

  getDistance (): number {
    return this.distance
  }
}
