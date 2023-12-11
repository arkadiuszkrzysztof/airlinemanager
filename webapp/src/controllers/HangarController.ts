import { type Plane } from '../models/Plane'
import { ContractsController } from './ContractsController'
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

  getHubs (region?: string): Set<string> {
    const hubs = new Set<string>()

    this.assets.forEach((asset) => {
      if (asset.plane.hub !== undefined && (region === undefined || asset.plane.hub.region === region)) {
        hubs.add(asset.plane.hub.IATACode)
      }
    })

    return hubs
  }

  public static getInstance (): HangarController {
    if (HangarController.instance === undefined) {
      HangarController.instance = new HangarController()
    }

    return HangarController.instance
  }
}
