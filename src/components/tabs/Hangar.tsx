import React, { useEffect } from 'react'

import { HouseDoor } from 'react-bootstrap-icons'
import ListPreviewWidget from '../widgets/ListPreviewWidget'
import HangarListItem from '../widgets/listitems/HangarListItem'
import { type HangarAsset } from '../../controllers/HangarController'
import { GameController } from '../../controllers/GameController'
import HangarFilter from '../fragments/HangarFilter'

const Operations: React.FC = () => {
  const Controllers = GameController.getInstance()

  const [assets, setAssets] = React.useState<HangarAsset[]>([])

  useEffect(() => {
    setAssets(Controllers.Hangar.getAllAssets())
  }, [])

  Controllers.Hangar.registerListener('hangarListPreview', setAssets)

  return (
    <>
        <ListPreviewWidget<HangarAsset>
          Icon={HouseDoor}
          header={`Hangar (${Controllers.Hangar.getAssetsCount()}/${Controllers.Airline.getTier().record.constraints.maxPlanes})`}
          Component={HangarListItem}
          items={assets.sort((a, b) => (b.plane.acquisitionTime ?? 0) - (a.plane.acquisitionTime ?? 0))}
          FilterSection={HangarFilter}
          fullWidth
          fullHeight
        />
    </>
  )
}

export default Operations
