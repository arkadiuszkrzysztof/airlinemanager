import React from 'react'

import { CartCheck, FileEarmarkText, HouseDoor } from 'react-bootstrap-icons'
import { type Plane } from '../../models/Plane'
import { type Contract } from '../../models/Contract'
import ListPreviewWidget from '../widgets/ListPreviewWidget'
import MarketListItem from '../widgets/listitems/MarketListItem'
import ContractListItem from '../widgets/listitems/ContractListItem'
import HangarListItem from '../widgets/listitems/HangarListItem'
import { type HangarAsset } from '../../controllers/HangarController'
import { type Controllers } from '../../controllers/GameController'

interface Props {
  assets: HangarAsset[]
  market: Plane[]
  contracts: Contract[]
  Controllers: Controllers
}

const Operations: React.FC<Props> = ({ assets, market, contracts, Controllers }) => {
  return (
    <>
      <ListPreviewWidget<Plane>
          Icon={CartCheck}
          header='Market'
          subheader={`Refresh in ${Controllers.Clock.timeToNextWeek}`}
          Component={MarketListItem}
          items={market.sort((a, b) => b.reputation - a.reputation)}
        />
        <ListPreviewWidget<Contract>
          Icon={FileEarmarkText}
          header='Contracts'
          subheader={`Refresh in ${Controllers.Clock.timeToNextDay}`}
          Component={ContractListItem}
          items={contracts}
        />
        <ListPreviewWidget<HangarAsset>
          Icon={HouseDoor}
          header={`Hangar (${Controllers.Hangar.getAssetsCount()}/${Controllers.Airline.getTier().record.constraints.maxPlanes})`}
          Component={HangarListItem}
          items={assets.sort((a, b) => (b.plane.acquisitionTime ?? 0) - (a.plane.acquisitionTime ?? 0))}
          fullWidth={true}
        />
    </>
  )
}

export default Operations
