import { type Airport } from './Airport'

export type ContractTuple = [
  hub: Airport,
  destination: Airport,
  distance: number
]

export const convertToContractTuple = (contract: Contract): ContractTuple => {
  return [
    contract.hub,
    contract.destination,
    contract.distance
  ]
}

export class Contract {
  public readonly hub: Airport
  public readonly destination: Airport
  public readonly distance: number

  constructor (hub: Airport, destination: Airport, distance: number) {
    this.hub = hub
    this.destination = destination
    this.distance = distance
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
