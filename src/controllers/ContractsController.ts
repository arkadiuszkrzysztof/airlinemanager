import { Autobind } from './helpers/Autobind'
import { Airport, AirportsData, type Regions, calculateAirportsDistance, RegionsKeys } from '../models/Airport'
import { Contract } from '../models/Contract'
import { Timeframes } from './helpers/Clock'
import { type HangarAsset, HangarController } from './HangarController'
import { LocalStorage } from './helpers/LocalStorage'
import { ScheduleController } from './ScheduleController'
import { getRandomCharacters } from './helpers/Helpers'
import { AirlineController } from './AirlineController'
import { GameController } from './GameController'

export interface CostsBreakdown {
  fuel: number
  maintenance: number
  leasing: number
  landing: number
  passenger: number
  cancellationFee?: number
  downpayment?: number
  purchasing?: number
  unlockingRegions?: number
  total: number
}
export interface RevenuesBreakdown {
  economy: number
  business: number
  first: number
  selling?: number
  missions?: number
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
  numberOfPassengers: {
    economy: number
    business: number
    first: number
    total: number
  }
  available: boolean
}

export class ContractsController {
  private static instance: ContractsController
  private readonly listeners: Record<string, (contracts: Array<{ contract: Contract, options: ContractOption[] }>) => void> = {}

  private readonly airports: Record<keyof typeof Regions, Airport[]>
  private contracts: Contract[]
  private inactiveContracts: Contract[]

  private constructor () {
    const [NA, EU, ASIA, LATAM, AFRICA, OCEANIA] = RegionsKeys

    this.airports = {
      NA: AirportsData.NA.map(airportData => new Airport(...[NA, ...airportData] as const)),
      EU: AirportsData.EU.map(airportData => new Airport(...[EU, ...airportData] as const)),
      ASIA: AirportsData.ASIA.map(airportData => new Airport(...[ASIA, ...airportData] as const)),
      LATAM: AirportsData.LATAM.map(airportData => new Airport(...[LATAM, ...airportData] as const)),
      AFRICA: AirportsData.AFRICA.map(airportData => new Airport(...[AFRICA, ...airportData] as const)),
      OCEANIA: AirportsData.OCEANIA.map(airportData => new Airport(...[OCEANIA, ...airportData] as const))
    }
    this.contracts = LocalStorage.getContractsOffers()
    this.inactiveContracts = LocalStorage.getInactiveContracts()
  }

  public registerListener (name: string, listener: (contracts: Array<{ contract: Contract, options: ContractOption[] }>) => void): void {
    this.listeners[name] = listener
  }

  private callListeners (contracts: Array<{ contract: Contract, options: ContractOption[] }>): void {
    Object.values(this.listeners).forEach(listener => { listener(contracts) })
  }

  public static getInstance (): ContractsController {
    if (ContractsController.instance === undefined) {
      ContractsController.instance = new ContractsController()
    }

    return ContractsController.instance
  }

  public getAirports (): Record<keyof typeof Regions, Airport[]> {
    return this.airports
  }

  public getAllAirports (): Airport[] {
    return Object.values(this.airports).flat()
  }

  private getNewContract (airport1: Airport, airport2: Airport): Contract {
    const id = `${airport1.IATACode}${airport2.IATACode}-${getRandomCharacters(4, true)}`
    const distance = calculateAirportsDistance(airport1, airport2)
    const departureTime = Math.floor(Math.random() * Timeframes.WEEK)

    const minPassengers = Math.min(airport1.passengers, airport2.passengers)
    const maxPassengers = Math.max(airport1.passengers, airport2.passengers)
    const demandRatio = 0.25 * Math.pow((minPassengers - 50000000) / 25000000, 2) + 0.05 * Math.pow((maxPassengers - 100000000) / 50000000, 2) + 1
    const demand = {
      economy: Math.floor(demandRatio * (minPassengers / 15000000) * 300),
      business: Math.floor(demandRatio * (minPassengers / 15000000) * 25),
      first: Math.floor(demandRatio * (minPassengers / 15000000) * 5)
    }

    const contractDuration = Timeframes.MONTH * Math.floor(Math.random() * 8 + 4)
    const reputation = Math.floor((distance * 2 / 10000) * AirlineController.getInstance().getTier().record.constraints.reputationGain * 100) / 100

    return new Contract(id, airport1, airport2, distance, departureTime, contractDuration, demand, false, 0, 0, reputation)
  }

  private generateRegionalContracts (region: string): Contract[] {
    const contracts: Contract[] = []

    const hubAirports = HangarController.getInstance().getHubs(region)
    const regionAirports = this.airports[region as keyof typeof Regions]
    const numberOfContractsToGenerate = hubAirports.length * 2 + Math.floor(Math.random() * 10 + 5)

    for (; contracts.length < numberOfContractsToGenerate;) {
      const airport1 = (contracts.length < hubAirports.length * 2
        ? hubAirports[Math.floor(Math.random() * hubAirports.length)]
        : regionAirports[Math.floor(Math.random() * regionAirports.length)])
      const airport2 = regionAirports[Math.floor(Math.random() * regionAirports.length)]

      if (airport1.IATACode === airport2.IATACode) {
        continue
      }

      contracts.push(this.getNewContract(airport1, airport2))
    }

    return contracts
  }

  private generateCrossRegionContracts (): Contract[] {
    const contracts: Contract[] = []

    const hubAirports = HangarController.getInstance().getHubs().filter(hub => hub.passengers > 10000000)
    const destinationAirports = this.getAllAirports().filter(airport => airport.passengers > 10000000 && AirlineController.getInstance().unlockedRegions.includes(airport.region))
    const numberOfContractsToGenerate = hubAirports.length * 2 + Math.floor(Math.random() * 10 + 5)

    for (; contracts.length < numberOfContractsToGenerate;) {
      const airport1 = (contracts.length < hubAirports.length * 2
        ? hubAirports[Math.floor(Math.random() * hubAirports.length)]
        : destinationAirports[Math.floor(Math.random() * destinationAirports.length)])
      const airport2 = destinationAirports[Math.floor(Math.random() * destinationAirports.length)]

      if (airport1.IATACode === airport2.IATACode || airport1.region === airport2.region) {
        continue
      }

      contracts.push(this.getNewContract(airport1, airport2))
    }

    return contracts
  }

  private calculateCost (contract: Contract, asset: HangarAsset): CostsBreakdown {
    const Controllers = GameController.getInstance()

    const econonyPassengers = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
    const businessPassengers = Math.min(contract.demand.business, asset.plane.maxSeating.business)
    const firstPassengers = Math.min(contract.demand.first, asset.plane.maxSeating.first)

    const contractPlaneCapacity = econonyPassengers + businessPassengers + firstPassengers

    const tier = Controllers.Airline.getTier().record
    const isDestAHub = Controllers.Hangar.getHubs().filter(hub => hub.IATACode === contract.destination.IATACode).length > 0

    const duration = contract.distance / asset.plane.cruiseSpeed
    const fuelCost = Math.floor(asset.plane.fuelConsumption * duration)
    const maintenanceCost = Math.floor(asset.plane.pricing.maintenance * duration)
    const leasingCost = asset.ownership === 'leased' ? Math.floor(asset.plane.pricing.lease * duration) : 0
    const passengerFee = Math.floor(contract.hub.fees.passenger * (1 - tier.perks.hubDiscount) + contract.destination.fees.passenger * (1 - (isDestAHub ? tier.perks.hubDiscount : tier.perks.destinationDiscount))) * contractPlaneCapacity
    const landingFee = Math.floor(contract.hub.fees.landing * (1 - tier.perks.hubDiscount) + contract.destination.fees.landing * (1 - (isDestAHub ? tier.perks.hubDiscount : tier.perks.destinationDiscount))) * asset.plane.MTOW

    return {
      fuel: fuelCost * 2,
      maintenance: maintenanceCost * 2,
      leasing: leasingCost * 2,
      landing: landingFee * 2,
      passenger: passengerFee,
      total: Math.floor(fuelCost + maintenanceCost + leasingCost + landingFee) * 2 + passengerFee
    }
  }

  private calculateRevenue (contract: Contract, asset: HangarAsset, passengers: { economy: number, business: number, first: number }): RevenuesBreakdown {
    const duration = contract.distance / asset.plane.cruiseSpeed

    const economyTicketsRevenue = Math.floor(passengers.economy * 50 * duration * 2) + passengers.economy * 10 * 2
    const businessTicketsRevenue = Math.floor(passengers.business * 250 * duration * 2) + passengers.business * 20 * 2
    const firsTicketRevenue = Math.floor(passengers.first * 750 * duration * 2) + passengers.first * 50 * 2

    if (asset.plane.typeName === 'Concorde') {
      return {
        economy: economyTicketsRevenue,
        business: businessTicketsRevenue * 3,
        first: firsTicketRevenue * 3,
        total: economyTicketsRevenue + businessTicketsRevenue * 3 + firsTicketRevenue * 3
      }
    } else {
      return {
        economy: economyTicketsRevenue,
        business: businessTicketsRevenue,
        first: firsTicketRevenue,
        total: economyTicketsRevenue + businessTicketsRevenue + firsTicketRevenue
      }
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

  public canAssignSchedule (activeSchedules: Array<{ start: number, end: number }>, proposedSchedule: { start: number, end: number }): boolean {
    const [proposedStart, proposedEnd] = [proposedSchedule.start, (proposedSchedule.end < proposedSchedule.start ? proposedSchedule.end + Timeframes.WEEK : proposedSchedule.end)]
    let canAssignSchedule = true

    activeSchedules.forEach(activeSchedule => {
      const [activeStart, activeEnd] = [activeSchedule.start, (activeSchedule.end < activeSchedule.start ? activeSchedule.end + Timeframes.WEEK : activeSchedule.end)]

      if (
        (proposedStart >= activeStart && proposedStart <= activeEnd) ||
        (proposedEnd >= activeStart && proposedEnd <= activeEnd) ||
        (proposedStart <= activeStart && proposedEnd >= activeEnd) ||
        (activeSchedule.end < activeSchedule.start && proposedStart <= activeEnd % Timeframes.WEEK) ||
        (proposedSchedule.end < proposedSchedule.start && activeStart <= proposedEnd % Timeframes.WEEK)
      ) {
        canAssignSchedule = false
      }
    })

    return canAssignSchedule
  }

  public isPlaneAvailable (contract: Contract, option: ContractOption): boolean {
    if (option.asset.plane.hub !== undefined && contract.hub.IATACode !== option.asset.plane.hub.IATACode) {
      return false
    }

    const proposedSchedule = ScheduleController.getInstance().draftSchedule(contract, option)
    const activeSchedules = ScheduleController.getInstance().getActiveSchedulesForAsset(option.asset)

    return this.canAssignSchedule(activeSchedules, proposedSchedule)
  }

  public getContractOptions (contract: Contract): ContractOption[] {
    const hangarController = HangarController.getInstance()
    const options: ContractOption[] = []

    hangarController
      .getAllAssets()
      .filter(asset => (asset.plane.hub === undefined || asset.plane.hub.IATACode === contract.hub.IATACode) && asset.plane.maxRange >= contract.distance)
      .forEach((asset) => {
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
          numberOfPassengers: {
            economy,
            business,
            first,
            total: economy + business + first
          },
          available: true
        }

        const available = this.isPlaneAvailable(contract, option)
        option.available = available

        if (option.available) {
          options.push(option)
        }
      })

    return options.sort((a, b) => b.profit - a.profit)
  }

  private getContractsOptionsForAll (): Array<{ contract: Contract, options: ContractOption[] }> {
    const allContracts = [...this.inactiveContracts.concat(...this.contracts)]
    const allContractsWithOptions = allContracts.map(contract => ({ contract, options: this.getContractOptions(contract) }))

    return allContractsWithOptions.filter(c => c.contract.accepted)
      .concat(allContractsWithOptions.filter(c => c.options.length > 0 && !c.contract.accepted))
      .concat(allContractsWithOptions.filter(c => c.options.length === 0 && !c.contract.accepted))
  }

  public getContractOffMarket (contract: Contract, wasAccepted: boolean): void {
    if (wasAccepted) {
      this.inactiveContracts = this.inactiveContracts.filter(c => c.id !== contract.id)
      LocalStorage.setInactiveContracts(this.inactiveContracts)
    } else {
      this.contracts = this.contracts.filter(c => c.id !== contract.id)
      LocalStorage.setContractsOffers(this.contracts)
    }
    this.callListeners(this.getContractsOptionsForAll())
  }

  public getContractsOffPlane (asset: HangarAsset): void {
    const contracts = ScheduleController.getInstance().getActiveSchedulesForAsset(asset).map(schedule => schedule.contract)

    this.inactiveContracts = this.inactiveContracts.concat(contracts)
    LocalStorage.setInactiveContracts(this.inactiveContracts)

    ScheduleController.getInstance().removeActiveSchedulesForAsset(asset)

    this.callListeners(this.getContractsOptionsForAll())
  }

  @Autobind
  public getAvailableContracts (playtime: number): Array<{ contract: Contract, options: ContractOption[] }> {
    const lastRefresh = LocalStorage.getLastContractsRefresh()

    if (lastRefresh === -1 || playtime - lastRefresh >= Timeframes.DAY) {
      let newContracts: Contract[] = []
      AirlineController.getInstance().unlockedRegions.forEach(region => {
        newContracts = newContracts.concat(this.generateRegionalContracts(region))
      })

      if (AirlineController.getInstance().getTier().record.constraints.canFlyCrossRegion && AirlineController.getInstance().unlockedRegions.length > 1) {
        newContracts = newContracts.concat(this.generateCrossRegionContracts())
      }

      newContracts = newContracts.sort((a, b) => b.reputation - a.reputation)

      LocalStorage.setContractsOffers(newContracts)
      LocalStorage.setLastContractsRefresh(playtime - (playtime % Timeframes.DAY))
      this.contracts = newContracts
      this.callListeners(this.getContractsOptionsForAll())
      return this.getContractsOptionsForAll()
    } else {
      return this.getContractsOptionsForAll()
    }
  }
}
