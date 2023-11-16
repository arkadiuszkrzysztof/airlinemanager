import { type Plane } from '../models/Plane'
import { LocalStorage } from './LocalStorage'
import { MarketController } from './MarketController'

export interface HangarAsset { plane: Plane, ownership: 'owned' | 'leased' }

export class HangarController {
  private readonly assets: HangarAsset[]
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

  getAllAssets (): HangarAsset[] {
    return this.assets
  }

  getAssetsCount (): number {
    return this.assets.length
  }

  public static getInstance (): HangarController {
    if (HangarController.instance === undefined) {
      HangarController.instance = new HangarController()
    }

    return HangarController.instance
  }
}
