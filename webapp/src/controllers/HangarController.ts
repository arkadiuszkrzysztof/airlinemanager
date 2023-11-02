import { type Plane } from '../models/Plane'

export interface HangarAsset { plane: Plane, ownership: 'owned' | 'leased' }

export class HangarController {
  private readonly assets: HangarAsset[]
  private static instance: HangarController

  private constructor () {
    this.assets = []
  }

  public addAsset (asset: HangarAsset): void {
    this.assets.push(asset)
  }

  getAllAssets (): HangarAsset[] {
    return this.assets
  }

  public static getInstance (): HangarController {
    if (HangarController.instance === undefined) {
      HangarController.instance = new HangarController()
    }

    return HangarController.instance
  }
}
