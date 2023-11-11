import { Autobind } from '../decorators/Autobind'
import { Airport, AirportsData, calculateAirportsDistance } from '../models/Airport'
import { Contract } from '../models/Contract'
import { Timeframes, DaysOfWeek } from './Clock'
import { LocalStorage } from './LocalStorage'

export class ContractsController {
  private static instance: ContractsController
  private readonly listeners: Record<string, (contracts: Contract[]) => void> = {}

  private readonly airports: Airport[]
  private contracts: Contract[]

  private constructor () {
    this.airports = AirportsData.EU.map(airportData => new Airport(...airportData))
    this.contracts = LocalStorage.getContractsOffers()
  }

  public registerListener (name: string, listener: (contracts: Contract[]) => void): void {
    this.listeners[name] = listener
  }

  private callListener (contracts: Contract[]): void {
    Object.values(this.listeners).forEach(listener => { listener(contracts) })
  }

  public static getInstance (): ContractsController {
    if (ContractsController.instance === undefined) {
      ContractsController.instance = new ContractsController()
    }

    return ContractsController.instance
  }

  private generateContracts (): Contract[] {
    const contracts: Contract[] = []
    const connections: string[] = []

    for (let i = contracts.length; i < Math.random() * 5 + 2;) {
      const airport1 = this.airports[Math.floor(Math.random() * this.airports.length)]
      const airport2 = this.airports[Math.floor(Math.random() * this.airports.length)]

      const connection = `${airport1.IATACode}${airport2.IATACode}`

      if (airport1 === airport2 || connections.includes(connection)) {
        continue
      }

      const distance = calculateAirportsDistance(airport1, airport2)
      const dayOfWeek = Object.values(DaysOfWeek)[Math.floor(Math.random() * Object.values(DaysOfWeek).length)]
      const demandRatio = (airport1.passengers + airport2.passengers) / 100000000
      const demand = { economy: Math.floor(demandRatio * 300), business: Math.floor(demandRatio * 50), first: Math.floor(demandRatio * 10) }

      connections.push(connection)
      contracts.push(new Contract(airport1, airport2, distance, dayOfWeek, demand))
    }

    return contracts
  }

  @Autobind
  public getAvailableContracts (playtime: number): Contract[] {
    const lastRefresh = LocalStorage.getLastContractsRefresh()

    if (lastRefresh === 0 || playtime - lastRefresh >= Timeframes.DAY) {
      const newContracts = this.generateContracts()
      LocalStorage.setContractsOffers(newContracts)
      LocalStorage.setLastContractsRefresh(playtime - playtime % Timeframes.DAY)
      this.callListener(newContracts)
      this.contracts = newContracts
      return newContracts
    } else {
      return this.contracts
    }
  }
}
