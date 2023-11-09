import { Plane } from '../models/Plane'

enum Keys {
  PLAYTIME = 'playtime',
  LAST_SAVE = 'lastSave',
  OFFLINE_TIME = 'ofillineTime',
  MARKET_OFFERS = 'marketOffers',
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
  getMarketOffers (): Plane[] {
    const offers = localStorage.getItem(Keys.MARKET_OFFERS)
    let offersItems = (offers !== null) ? JSON.parse(offers) : []

    offersItems = offersItems.map((offer: Plane) =>
      new Plane(
        offer.familyName,
        offer.subtypeName,
        offer.maxSeating,
        offer.MTOW,
        offer.maxRange,
        offer.maxFuel,
        offer.cruiseSpeed,
        offer.fuelConsumption,
        offer.pricing,
        offer.registration,
        offer.manufacturedWeek
      )
    )

    return offersItems
  },
  setMarketOffers (offers: Plane[]): void {
    localStorage.setItem(Keys.MARKET_OFFERS, JSON.stringify(offers))
  }
}
