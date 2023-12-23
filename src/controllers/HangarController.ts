import { type Airport } from '../models/Airport'
import { type Plane } from '../models/Plane'
import { ContractsController } from './ContractsController'
import { Clock, Timeframes } from './helpers/Clock'
import { LocalStorage } from './helpers/LocalStorage'
import { MarketController } from './MarketController'

export interface HangarAsset { plane: Plane, ownership: 'owned' | 'leased' }

export class HangarController {
  private assets: HangarAsset[]
  private static instance: HangarController
  private readonly listeners: Record<string, (assets: HangarAsset[]) => void> = {}

  private constructor () {
    this.assets = LocalStorage.getHangarPlanes()
  }

  private callListeners (assets: HangarAsset[]): void {
    Object.values(this.listeners).forEach(listener => { listener(assets) })
  }

  public registerListener (name: string, listener: (assets: HangarAsset[]) => void): void {
    this.listeners[name] = listener
  }

  public addAsset (asset: HangarAsset): void {
    this.assets.push(asset)
    LocalStorage.setHangarPlanes(this.assets)
    this.callListeners([...this.assets])
    MarketController.getInstance().getPlaneOffMarket(asset.plane)
  }

  public removeAsset (asset: HangarAsset): void {
    ContractsController.getInstance().getContractsOffPlane(asset)

    this.assets = this.assets.filter(a => a.plane.registration !== asset.plane.registration)
    LocalStorage.setHangarPlanes(this.assets)
    this.callListeners([...this.assets])
  }

  getAllAssets (): HangarAsset[] {
    return this.assets
  }

  getOwnedAssets (): HangarAsset[] {
    return this.assets.filter(asset => asset.ownership === 'owned')
  }

  getLeasedAssets (): HangarAsset[] {
    return this.assets.filter(asset => asset.ownership === 'leased')
  }

  getAssetsCount (): number {
    return this.assets.length
  }

  saveAssets (): void {
    LocalStorage.setHangarPlanes(this.assets)
    this.callListeners([...this.assets])
  }

  getHubs (region?: string): Airport[] {
    const hubs: Airport[] = []

    this.assets.forEach((asset) => {
      if (asset.plane.hub !== undefined && (region === undefined || asset.plane.hub.region === region) && hubs.filter(hub => asset.plane.hub?.IATACode === hub.IATACode).length === 0) {
        hubs.push(asset.plane.hub)
      }
    })

    return hubs
  }

  public getPlanesAges (): { average: number, ages: Record<string, number> } {
    const allAges = this.assets.map(asset => Math.round((Clock.getInstance().playtime - asset.plane.manufactureTime) / Timeframes.YEAR))
    const average = allAges.reduce((a, b) => a + b, 0) / allAges.length
    const ages = allAges.reduce((ages: Record<string, number>, age) => { ages[(age <= 20 ? age : 20)] = (ages[(age <= 20 ? age : 20)] !== undefined ? ages[(age <= 20 ? age : 20)] + 1 : 1); return ages }, {})

    return { average, ages }
  }

  public static getInstance (): HangarController {
    if (HangarController.instance === undefined) {
      HangarController.instance = new HangarController()
    }

    return HangarController.instance
  }
}
