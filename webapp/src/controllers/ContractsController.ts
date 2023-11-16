import { Autobind } from '../decorators/Autobind'
import { Airport, AirportsData, calculateAirportsDistance } from '../models/Airport'
import { Contract } from '../models/Contract'
import { Timeframes, DaysOfWeek, Clock } from './Clock'
import { type HangarAsset, HangarController } from './HangarController'
import { LocalStorage } from './LocalStorage'
import { ScheduleController } from './ScheduleController'
import { getRandomCharacters } from './helpers/Helpers'

export interface ContractOptionCosts {
  fuel: number
  maintenance: number
  leasing: number
  landing: number
  passenger: number
  total: number
}
export interface ContractOptionRevenues {
  economy: number
  business: number
  first: number
  total: number
}
export interface ContractOption {
  asset: HangarAsset
  cost: ContractOptionCosts
  revenue: ContractOptionRevenues
  profit: number
  utilization: number
  turnaround: number
  available: boolean
}

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

  private callListeners (contracts: Contract[]): void {
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

    for (; contracts.length < Math.random() * 5 + 2;) {
      const airport1 = this.airports[Math.floor(Math.random() * this.airports.length)]
      const airport2 = this.airports[Math.floor(Math.random() * this.airports.length)]

      const connection = `${airport1.IATACode}${airport2.IATACode}`

      if (airport1 === airport2 || connections.includes(connection)) {
        continue
      }

      const id = `${airport1.IATACode}${airport2.IATACode}-${getRandomCharacters(4, true)}`
      const distance = calculateAirportsDistance(airport1, airport2)
      const dayOfWeek = Object.values(DaysOfWeek)[Math.floor(Math.random() * Object.values(DaysOfWeek).length)]
      const departureTime = `${Math.floor(Math.random() * 18 + 5).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      const demandRatio = (airport1.passengers + airport2.passengers) / 100000000
      const demand = { economy: Math.floor(demandRatio * 300), business: Math.floor(demandRatio * 50), first: Math.floor(demandRatio * 10) }
      const contractDuration = Timeframes.MONTH * Math.floor(Math.random() * 8 + 4)

      connections.push(connection)
      contracts.push(new Contract(id, airport1, airport2, distance, dayOfWeek, departureTime, contractDuration, demand))
    }

    return contracts
  }

  private calculateCost (contract: Contract, asset: HangarAsset): ContractOptionCosts {
    const econonyPassengers = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
    const businessPassengers = Math.min(contract.demand.business, asset.plane.maxSeating.business)
    const firstPassengers = Math.min(contract.demand.first, asset.plane.maxSeating.first)

    const contractPlaneCapacity = econonyPassengers + businessPassengers + firstPassengers

    const duration = contract.distance / asset.plane.cruiseSpeed
    const fuelCost = asset.plane.fuelConsumption * duration
    const maintenanceCost = asset.plane.pricing.maintenance * duration
    const leasingCost = asset.ownership === 'leased' ? asset.plane.pricing.lease * duration : 0
    const passengerFee = (contract.hub.fees.passenger + contract.destination.fees.passenger) * contractPlaneCapacity
    const landingFee = (contract.hub.fees.landing + contract.destination.fees.landing) * asset.plane.MTOW

    return {
      fuel: fuelCost,
      maintenance: maintenanceCost,
      leasing: leasingCost,
      landing: landingFee,
      passenger: passengerFee,
      total: Math.floor(fuelCost + maintenanceCost + leasingCost + landingFee) * 2 + passengerFee
    }
  }

  private calculateRevenue (contract: Contract, asset: HangarAsset): ContractOptionRevenues {
    const econonyPassengers = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
    const businessPassengers = Math.min(contract.demand.business, asset.plane.maxSeating.business)
    const firstPassengers = Math.min(contract.demand.first, asset.plane.maxSeating.first)

    const duration = contract.distance / asset.plane.cruiseSpeed

    const economyTicketsRevenue = econonyPassengers * 200 * duration * 2 + econonyPassengers * 100 * 2
    const businessTicketsRevenue = businessPassengers * 600 * duration * 2 + businessPassengers * 200 * 2
    const firsTicketRevenue = firstPassengers * 1200 * duration * 2 + firstPassengers * 400 * 2

    return {
      economy: economyTicketsRevenue,
      business: businessTicketsRevenue,
      first: firsTicketRevenue,
      total: economyTicketsRevenue + businessTicketsRevenue + firsTicketRevenue
    }
  }

  private calculateUtilization (contract: Contract, asset: HangarAsset): number {
    const econonyPassengers = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
    const businessPassengers = Math.min(contract.demand.business, asset.plane.maxSeating.business)
    const firstPassengers = Math.min(contract.demand.first, asset.plane.maxSeating.first)

    const totalPlaneCapacity = asset.plane.maxSeating.economy + asset.plane.maxSeating.business + asset.plane.maxSeating.first
    const contractPlaneCapacity = econonyPassengers + businessPassengers + firstPassengers

    return Math.floor(contractPlaneCapacity / totalPlaneCapacity * 100)
  }

  private calculateTurnaround (contract: Contract, asset: HangarAsset): number {
    const duration = contract.distance / asset.plane.cruiseSpeed
    const totalSeats = asset.plane.maxSeating.economy + asset.plane.maxSeating.business + asset.plane.maxSeating.first
    const turnaround = totalSeats < 100 ? totalSeats * 0.75 : totalSeats < 200 ? totalSeats * 0.65 : totalSeats * 0.55

    return duration * 2 * 60 + turnaround
  }

  private checkAvailability (contract: Contract, option: ContractOption): boolean {
    let available = true

    const schedule = ScheduleController.getInstance().draftSchedule(contract, option)
    const activeSchedules = ScheduleController.getInstance()
      .getActiveSchedulesForAsset(option.asset)
      .filter(schedule => schedule.day === contract.dayOfWeek)

    activeSchedules.forEach(activeSchedule => {
      if (Clock.isTimeBetween(schedule.start, activeSchedule.start, activeSchedule.end) ||
        Clock.isTimeBetween(schedule.end, activeSchedule.start, activeSchedule.end) ||
        Clock.isTimeBetween(activeSchedule.start, schedule.start, schedule.end) ||
        Clock.isTimeBetween(activeSchedule.end, schedule.start, schedule.end)) {
        available = false
      }
    })

    return available
  }

  public getContractOptions (contract: Contract): ContractOption[] {
    const hangarController = HangarController.getInstance()
    const options: ContractOption[] = []

    hangarController.getAllAssets().forEach((asset) => {
      const cost = this.calculateCost(contract, asset)
      const revenue = this.calculateRevenue(contract, asset)

      const option = {
        asset,
        cost,
        revenue,
        profit: revenue.total - cost.total,
        utilization: this.calculateUtilization(contract, asset),
        turnaround: this.calculateTurnaround(contract, asset),
        available: true
      }

      const available = this.checkAvailability(contract, option)
      option.available = available

      options.push(option)
    })

    return options.sort((a, b) => b.profit - a.profit)
  }

  public getContractOffMarket (contract: Contract): void {
    this.contracts = this.contracts.filter(c =>
      `${c.hub.IATACode}${c.destination.IATACode}` !== `${contract.hub.IATACode}${contract.destination.IATACode}`)
    LocalStorage.setContractsOffers(this.contracts)
    this.callListeners([...this.contracts])
  }

  @Autobind
  public getAvailableContracts (playtime: number): Contract[] {
    const lastRefresh = LocalStorage.getLastContractsRefresh()

    if (lastRefresh === 0 || playtime - lastRefresh >= Timeframes.DAY) {
      const newContracts = this.generateContracts().sort((a, b) => b.distance - a.distance)
      LocalStorage.setContractsOffers(newContracts)
      LocalStorage.setLastContractsRefresh(playtime - playtime % Timeframes.DAY)
      this.callListeners(newContracts)
      this.contracts = newContracts
      return newContracts
    } else {
      return this.contracts
    }
  }
}
