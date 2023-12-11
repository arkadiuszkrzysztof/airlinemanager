import { Contract, convertToContractTuple } from '../../models/Contract'
import { Plane, convertToPlaneTuple } from '../../models/Plane'
import { type ReputationType, type EventOrigin, type PNLRecord } from '../AirlineController'
import { type HangarAsset } from '../HangarController'
import { type Achievement, type Mission } from '../MissionController'
import { type ScheduleEvent, type Schedule } from '../ScheduleController'

enum Keys {
  PLAYTIME = 'playtime',
  LAST_SAVE = 'lastSave',
  OFFLINE_TIME = 'ofillineTime',
  MARKET_OFFERS = 'marketOffers',
  LAST_MARKET_REFRESH = 'lastMarketRefresh',
  HANGAR_PLANES = 'hangarPlanes',
  CASH = 'cash',
  REPUTATION = 'reputation',
  AIRLINE_NAME = 'airlineName',
  CONTRACT_OFFERS = 'contractOffers',
  LAST_CONTRACT_REFRESH = 'lastContractRefresh',
  ACTIVE_SCHEDULES = 'activeSchedules',
  INACTIVE_CONTRACTS = 'inactiveContracts',
  SCHEDULE_EVENTS = 'scheduleEvents',
  LAST_SCHEDULE_EVENTS_REGISTRATION = 'lastScheduleEventsRegistration',
  PNL_RECORDS = 'pnlRecords',
  EVENT_LOG = 'eventLog',
  ACHIEVEMENTS_COMPLETED = 'achievementsCompleted',
  MISSIONS_COMPLETED = 'missionsCompleted',
  MISSIONS_PROGRESS = 'missionsProgress',
  GAME_ID = 'gameId',
  STARTING_REGION = 'startingRegion',
  UNLOCKED_REGIONS = 'unlockedRegions'
}

export const LocalStorage = {
  getPlaytime (): number {
    const playtime = localStorage.getItem(Keys.PLAYTIME)
    return (playtime !== null) ? parseInt(playtime) : 0
  },
  setPlaytime (playtime: number): void {
    localStorage.setItem(Keys.PLAYTIME, playtime.toString())
  },
  getLastSave (): number {
    const lastSave = localStorage.getItem(Keys.LAST_SAVE)
    return (lastSave !== null) ? parseInt(lastSave) : 0
  },
  setLastSave (lastSave: number): void {
    localStorage.setItem(Keys.LAST_SAVE, lastSave.toString())
  },
  getOfflineTime (): number {
    const offlineTime = localStorage.getItem(Keys.OFFLINE_TIME)
    return (offlineTime !== null && offlineTime !== '') ? parseInt(offlineTime) : 0
  },
  setOfflineTime (offlineTime: number): void {
    localStorage.setItem(Keys.OFFLINE_TIME, offlineTime.toString())
  },
  getLastMarketRefresh (): number {
    const lastMarketRefresh = localStorage.getItem(Keys.LAST_MARKET_REFRESH)
    return (lastMarketRefresh !== null) ? parseInt(lastMarketRefresh) : -1
  },
  setLastMarketRefresh (lastMarketRefresh: number): void {
    localStorage.setItem(Keys.LAST_MARKET_REFRESH, lastMarketRefresh.toString())
  },
  getMarketOffers (): Plane[] {
    const offers = localStorage.getItem(Keys.MARKET_OFFERS)
    let offersItems = (offers !== null) ? JSON.parse(offers) : []

    offersItems = offersItems.map((offer: Plane) => new Plane(...convertToPlaneTuple(offer)))

    return offersItems
  },
  setMarketOffers (offers: Plane[]): void {
    localStorage.setItem(Keys.MARKET_OFFERS, JSON.stringify(offers))
  },
  getHangarPlanes (): HangarAsset[] {
    const assets = localStorage.getItem(Keys.HANGAR_PLANES)
    let assetsItems = (assets !== null) ? JSON.parse(assets) : []

    assetsItems = assetsItems.map((asset: HangarAsset) => {
      return {
        plane: new Plane(...convertToPlaneTuple(asset.plane)),
        ownership: asset.ownership
      }
    }
    )

    return assetsItems
  },
  setHangarPlanes (assets: HangarAsset[]): void {
    localStorage.setItem(Keys.HANGAR_PLANES, JSON.stringify(assets))
  },
  getCash (): number {
    const cash = localStorage.getItem(Keys.CASH)
    return (cash !== null) ? parseInt(cash) : 0
  },
  setCash (cash: number): void {
    localStorage.setItem(Keys.CASH, cash.toString())
  },
  getReputation (): Array<{ originId: string, type: ReputationType, reputation: number }> {
    const reputation = localStorage.getItem(Keys.REPUTATION)
    return (reputation !== null) ? JSON.parse(reputation) : []
  },
  setReputation (reputation: Array<{ originId: string, type: ReputationType, reputation: number }>): void {
    localStorage.setItem(Keys.REPUTATION, JSON.stringify(reputation))
  },
  getAirlineName (): string {
    const airlineName = localStorage.getItem(Keys.AIRLINE_NAME)
    return airlineName ?? ''
  },
  setAirlineName (airlineName: string): void {
    localStorage.setItem(Keys.AIRLINE_NAME, airlineName)
  },
  getContractsOffers (): Contract[] {
    const offers = localStorage.getItem(Keys.CONTRACT_OFFERS)
    let offersItems = (offers !== null) ? JSON.parse(offers) : []

    offersItems = offersItems.map((offer: Contract) => new Contract(...convertToContractTuple(offer)))

    return offersItems
  },
  setContractsOffers (offers: Contract[]): void {
    localStorage.setItem(Keys.CONTRACT_OFFERS, JSON.stringify(offers))
  },
  getInactiveContracts (): Contract[] {
    const inactiveContracts = localStorage.getItem(Keys.INACTIVE_CONTRACTS)
    let inactiveContractsItems = (inactiveContracts !== null) ? JSON.parse(inactiveContracts) : []

    inactiveContractsItems = inactiveContractsItems.map((contract: Contract) => new Contract(...convertToContractTuple(contract)))

    return inactiveContractsItems
  },
  setInactiveContracts (inactiveContracts: Contract[]): void {
    localStorage.setItem(Keys.INACTIVE_CONTRACTS, JSON.stringify(inactiveContracts))
  },
  getLastContractsRefresh (): number {
    const lastContractRefresh = localStorage.getItem(Keys.LAST_CONTRACT_REFRESH)
    return (lastContractRefresh !== null) ? parseInt(lastContractRefresh) : -1
  },
  setLastContractsRefresh (lastContractRefresh: number): void {
    localStorage.setItem(Keys.LAST_CONTRACT_REFRESH, lastContractRefresh.toString())
  },
  getActiveSchedules (): Schedule[] {
    const activeSchedules = localStorage.getItem(Keys.ACTIVE_SCHEDULES)
    return (activeSchedules !== null) ? JSON.parse(activeSchedules) : []
  },
  setActiveSchedules (activeSchedules: Schedule[]): void {
    localStorage.setItem(Keys.ACTIVE_SCHEDULES, JSON.stringify(activeSchedules))
  },
  getScheduleEvents (): ScheduleEvent[] {
    const scheduleEvents = localStorage.getItem(Keys.SCHEDULE_EVENTS)
    return (scheduleEvents !== null) ? JSON.parse(scheduleEvents) : []
  },
  setScheduleEvents (scheduleEvents: ScheduleEvent[]): void {
    localStorage.setItem(Keys.SCHEDULE_EVENTS, JSON.stringify(scheduleEvents))
  },
  getLastScheduleEventsRegistration (): number {
    const lastScheduleEventsRegistration = localStorage.getItem(Keys.LAST_SCHEDULE_EVENTS_REGISTRATION)
    return (lastScheduleEventsRegistration !== null) ? parseInt(lastScheduleEventsRegistration) : 0
  },
  setLastScheduleEventsRegistration (lastScheduleEventsRegistration: number): void {
    localStorage.setItem(Keys.LAST_SCHEDULE_EVENTS_REGISTRATION, lastScheduleEventsRegistration.toString())
  },
  getPNL (): Record<number, PNLRecord> {
    const pnlRecords = localStorage.getItem(Keys.PNL_RECORDS)
    return (pnlRecords !== null) ? JSON.parse(pnlRecords) : {}
  },
  setPNL (pnlRecords: Record<number, PNLRecord>): void {
    localStorage.setItem(Keys.PNL_RECORDS, JSON.stringify(pnlRecords))
  },
  getEventLog (): Array<{ playtime: number, origin: EventOrigin, message: string }> {
    const eventLog = localStorage.getItem(Keys.EVENT_LOG)
    return (eventLog !== null) ? JSON.parse(eventLog) : []
  },
  setEventLog (eventLog: Array<{ playtime: number, origin: EventOrigin, message: string }>): void {
    localStorage.setItem(Keys.EVENT_LOG, JSON.stringify(eventLog))
  },
  getAchievementsCompleted (): Array<{ completedAt: number, achievement: Achievement }> {
    const achievementsCompleted = localStorage.getItem(Keys.ACHIEVEMENTS_COMPLETED)
    return (achievementsCompleted !== null) ? JSON.parse(achievementsCompleted) : []
  },
  setAchievementsCompleted (achievementsCompleted: Array<{ completedAt: number, achievement: Achievement }>): void {
    localStorage.setItem(Keys.ACHIEVEMENTS_COMPLETED, JSON.stringify(achievementsCompleted))
  },
  getMissionsCompleted (): Array<{ completedAt: number, mission: Mission }> {
    const missionsCompleted = localStorage.getItem(Keys.MISSIONS_COMPLETED)
    return (missionsCompleted !== null) ? JSON.parse(missionsCompleted) : []
  },
  setMissionsCompleted (missionsCompleted: Array<{ completedAt: number, mission: Mission }>): void {
    localStorage.setItem(Keys.MISSIONS_COMPLETED, JSON.stringify(missionsCompleted))
  },
  getMissionsProgress (): Record<string, number> {
    const missionsProgress = localStorage.getItem(Keys.MISSIONS_PROGRESS)
    return (missionsProgress !== null) ? JSON.parse(missionsProgress) : {}
  },
  setMissionsProgress (missionsProgress: Record<string, number>): void {
    localStorage.setItem(Keys.MISSIONS_PROGRESS, JSON.stringify(missionsProgress))
  },
  getGameId (): string {
    const gameId = localStorage.getItem(Keys.GAME_ID)
    return gameId ?? ''
  },
  setGameId (gameId: string): void {
    localStorage.setItem(Keys.GAME_ID, gameId)
  },
  getStartingRegion (): string {
    const startingRegion = localStorage.getItem(Keys.STARTING_REGION)
    return startingRegion ?? ''
  },
  setStartingRegion (startingRegion: string): void {
    localStorage.setItem(Keys.STARTING_REGION, startingRegion)
  },
  getUnlockedRegions (): string[] {
    const unlockedRegions = localStorage.getItem(Keys.UNLOCKED_REGIONS)
    return (unlockedRegions !== null) ? JSON.parse(unlockedRegions) : []
  },
  setUnlockedRegions (unlockedRegions: string[]): void {
    localStorage.setItem(Keys.UNLOCKED_REGIONS, JSON.stringify(unlockedRegions))
  },
  getAllAsJSON (): string {
    const keys = Object.values(Keys)
    const all: Record<string, string> = {}

    keys.forEach((key, index) => {
      all[key] = localStorage.getItem(key) ?? ''
    })

    return JSON.stringify(all)
  },
  setAllFromJSON (all: Record<string, string>): void {
    const keys = Object.keys(all)

    keys.forEach(key => {
      localStorage.setItem(key, all[key])
    })
  },
  clear (): void {
    localStorage.clear()
  }
}
