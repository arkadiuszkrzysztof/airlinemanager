import { Plane, convertToPlaneTuple } from '../models/Plane'
import { type HangarAsset } from './HangarController'

enum Keys {
  PLAYTIME = 'playtime',
  LAST_SAVE = 'lastSave',
  OFFLINE_TIME = 'ofillineTime',
  MARKET_OFFERS = 'marketOffers',
  LAST_MARKET_REFRESH = 'lastMarketRefresh',
  HANGAR_PLANES = 'hangarPlanes',
  CASH = 'cash',
  REPUTATION = 'reputation',
  AIRLINE_NAME = 'airlineName'
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
    return (offlineTime !== null) ? parseInt(offlineTime) : 0
  },
  setOfflineTime (offlineTime: number): void {
    localStorage.setItem(Keys.OFFLINE_TIME, offlineTime.toString())
  },
  getLastMarketRefresh (): number {
    const lastMarketRefresh = localStorage.getItem(Keys.LAST_MARKET_REFRESH)
    return (lastMarketRefresh !== null) ? parseInt(lastMarketRefresh) : 0
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
  getReputation (): number {
    const reputation = localStorage.getItem(Keys.REPUTATION)
    return (reputation !== null) ? parseInt(reputation) : 0
  },
  setReputation (reputation: number): void {
    localStorage.setItem(Keys.REPUTATION, reputation.toString())
  },
  getAirlineName (): string {
    const airlineName = localStorage.getItem(Keys.AIRLINE_NAME)
    return airlineName ?? ''
  },
  setAirlineName (airlineName: string): void {
    localStorage.setItem(Keys.AIRLINE_NAME, airlineName)
  }
}