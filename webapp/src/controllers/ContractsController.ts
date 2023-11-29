import { Autobind } from '../decorators/Autobind'
import { Airport, AirportsData, calculateAirportsDistance } from '../models/Airport'
import { Contract } from '../models/Contract'
import { Timeframes, DaysOfWeek, Clock } from './helpers/Clock'
import { type HangarAsset, HangarController } from './HangarController'
import { LocalStorage } from './helpers/LocalStorage'
import { ScheduleController } from './ScheduleController'
import { getRandomCharacters } from './helpers/Helpers'

export interface CostsBreakdown {
  fuel: number
  maintenance: number
  leasing: number
  landing: number
  passenger: number
  cancellationFee?: number
  downpayment?: number
  purchasing?: number
  total: number
}
export interface RevenuesBreakdown {
  economy: number
  business: number
  first: number
  selling?: number
  total: number
}

export interface ContractOption {
  asset: HangarAsset
  cost: CostsBreakdown
  revenue: RevenuesBreakdown
  profit: number
  utilization: number
  flightTime: number
  boardingTime: number
  totalTime: number
  numberOfPassengers: number
  available: boolean
}

export class ContractsController {
  private static instance: ContractsController
  private readonly listeners: Record<string, (contracts: Contract[]) => void> = {}

  private readonly airports: Airport[]
  private contracts: Contract[]
  private inactiveContracts: Contract[]

  private constructor () {
    this.airports = AirportsData.EU.map(airportData => new Airport(...airportData))
    this.contracts = LocalStorage.getContractsOffers()
    this.inactiveContracts = LocalStorage.getInactiveContracts()
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

  public getAirports (): Airport[] {
    return this.airports
  }

  private generateContracts (): Contract[] {
    const contracts: Contract[] = []
    const connections: string[] = []

    for (; contracts.length < Math.random() * 10 + 5;) {
      const airport1 = this.airports[Math.floor(Math.random() * this.airports.length)]
      const airport2 = this.airports[Math.floor(Math.random() * this.airports.length)]

      const connection = `${airport1.IATACode}${airport2.IATACode}`

      if (airport1 === airport2 || connections.includes(connection)) {
        continue
      }

      const id = `${airport1.IATACode}${airport2.IATACode}-${getRandomCharacters(4, true)}`
      const distance = calculateAirportsDistance(airport1, airport2)
      const dayOfWeek = Object.values(DaysOfWeek)[Math.floor(Math.random() * Object.values(DaysOfWeek).length)]
      const departureTime = `${Math.floor(Math.random() * 20 + 2).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      const demandRatio = (airport1.passengers + airport2.passengers) / 75000000
      const demand = { economy: Math.floor(demandRatio * 300), business: Math.floor(demandRatio * 25), first: Math.floor(demandRatio * 5) }
      const contractDuration = Timeframes.MONTH * Math.floor(Math.random() * 8 + 4)
      const reputation = Math.floor((distance * 2 / 10000) * 100) / 100

      connections.push(connection)
      contracts.push(new Contract(id, airport1, airport2, distance, dayOfWeek, departureTime, contractDuration, demand, false, 0, 0, reputation))
    }

    return contracts
  }

  private calculateCost (contract: Contract, asset: HangarAsset): CostsBreakdown {
    const econonyPassengers = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
    const businessPassengers = Math.min(contract.demand.business, asset.plane.maxSeating.business)
    const firstPassengers = Math.min(contract.demand.first, asset.plane.maxSeating.first)

    const contractPlaneCapacity = econonyPassengers + businessPassengers + firstPassengers

    const duration = contract.distance / asset.plane.cruiseSpeed
    const fuelCost = Math.floor(asset.plane.fuelConsumption * duration)
    const maintenanceCost = Math.floor(asset.plane.pricing.maintenance * duration)
    const leasingCost = asset.ownership === 'leased' ? Math.floor(asset.plane.pricing.lease * duration) : 0
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

  private calculateRevenue (contract: Contract, asset: HangarAsset, passengers: { economy: number, business: number, first: number }): RevenuesBreakdown {
    const duration = contract.distance / asset.plane.cruiseSpeed

    const economyTicketsRevenue = Math.floor(passengers.economy * 75 * duration * 2) + passengers.economy * 15 * 2
    const businessTicketsRevenue = Math.floor(passengers.business * 150 * duration * 2) + passengers.business * 20 * 2
    const firsTicketRevenue = Math.floor(passengers.first * 300 * duration * 2) + passengers.first * 30 * 2

    return {
      economy: economyTicketsRevenue,
      business: businessTicketsRevenue,
      first: firsTicketRevenue,
      total: economyTicketsRevenue + businessTicketsRevenue + firsTicketRevenue
    }
  }

  private calculateUtilization (contract: Contract, asset: HangarAsset, passengers: { economy: number, business: number, first: number }): number {
    const totalPlaneCapacity = asset.plane.maxSeating.economy + asset.plane.maxSeating.business + asset.plane.maxSeating.first
    const contractPlaneCapacity = passengers.economy + passengers.business + passengers.first

    return Math.floor(contractPlaneCapacity / totalPlaneCapacity * 100)
  }

  private calculateTurnaround (contract: Contract, asset: HangarAsset): { flightTime: number, boardingTime: number, totalTime: number } {
    const flightTime = Math.floor(contract.distance / asset.plane.cruiseSpeed * 60)
    const totalSeats = asset.plane.maxSeating.economy + asset.plane.maxSeating.business + asset.plane.maxSeating.first
    const boardingTime = Math.floor((totalSeats < 100 ? totalSeats * 0.75 : totalSeats < 200 ? totalSeats * 0.65 : totalSeats * 0.55) / 2)

    return { flightTime, boardingTime, totalTime: (flightTime + boardingTime) * 2 }
  }

  private checkAvailability (contract: Contract, option: ContractOption): boolean {
    if (option.asset.plane.hub !== undefined && contract.hub.IATACode !== option.asset.plane.hub.IATACode) return false

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
      const economy = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
      const business = Math.min(contract.demand.business, asset.plane.maxSeating.business)
      const first = Math.min(contract.demand.first, asset.plane.maxSeating.first)

      const cost = this.calculateCost(contract, asset)
      const revenue = this.calculateRevenue(contract, asset, { economy, business, first })
      const { flightTime, boardingTime, totalTime } = this.calculateTurnaround(contract, asset)

      const option = {
        asset,
        cost,
        revenue,
        profit: revenue.total - cost.total,
        utilization: this.calculateUtilization(contract, asset, { economy, business, first }),
        flightTime,
        boardingTime,
        totalTime,
        numberOfPassengers: economy + business + first,
        available: true
      }

      const available = this.checkAvailability(contract, option)
      option.available = available

      options.push(option)
    })

    return options.sort((a, b) => b.profit - a.profit)
  }

  public getContractOffMarket (contract: Contract, wasAccepted: boolean): void {
    if (wasAccepted) {
      this.inactiveContracts = this.inactiveContracts.filter(c => c.id !== contract.id)
      LocalStorage.setInactiveContracts(this.inactiveContracts)
    } else {
      this.contracts = this.contracts.filter(c => c.id !== contract.id)
      LocalStorage.setContractsOffers(this.contracts)
    }
    this.callListeners([...this.inactiveContracts.concat(...this.contracts)])
  }

  public getContractsOffPlane (asset: HangarAsset): void {
    const contracts = ScheduleController.getInstance().getActiveSchedulesForAsset(asset).map(schedule => schedule.contract)

    this.inactiveContracts = this.inactiveContracts.concat(contracts)
    LocalStorage.setInactiveContracts(this.inactiveContracts)

    ScheduleController.getInstance().removeActiveSchedulesForAsset(asset)

    this.callListeners([...this.inactiveContracts.concat(...this.contracts)])
  }

  @Autobind
  public getAvailableContracts (playtime: number): Contract[] {
    const lastRefresh = LocalStorage.getLastContractsRefresh()

    if (lastRefresh === 0 || playtime - lastRefresh >= Timeframes.DAY) {
      const newContracts = this.generateContracts().sort((a, b) => b.distance - a.distance)
      LocalStorage.setContractsOffers(newContracts)
      LocalStorage.setLastContractsRefresh(playtime - (playtime % Timeframes.DAY))
      this.callListeners(this.inactiveContracts.concat(...newContracts))
      this.contracts = newContracts
      return this.inactiveContracts.concat(...newContracts)
    } else {
      return this.inactiveContracts.concat(...this.contracts)
    }
  }
}
