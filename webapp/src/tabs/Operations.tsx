import React from 'react'

import { CartCheck, FileEarmarkText, HouseDoor } from 'react-bootstrap-icons'
import { type Plane } from '../models/Plane'
import { type Contract } from '../models/Contract'
import ListPreview from '../components/widgets/ListPreview'
import MarketListItem from '../components/MarketListItem'
import ContractListItem from '../components/ContractListItem'
import HangarListItem from '../components/HangarListItem'
import { type HangarAsset } from '../controllers/HangarController'
import { type Controllers } from '../controllers/GameController'

interface Props {
  assets: HangarAsset[]
  market: Plane[]
  contracts: Contract[]
  Controllers: Controllers
}

const Operations: React.FC<Props> = ({ assets, market, contracts, Controllers }) => {
  return (
    <>
      <ListPreview<Plane>
          Icon={CartCheck}
          header='Market'
          subheader={`Refresh in ${Controllers.Clock.timeToNextWeek}`}
          Component={MarketListItem}
          items={market.sort((a, b) => b.reputation - a.reputation)}
        />
        <ListPreview<Contract>
          Icon={FileEarmarkText}
          header='Contracts'
          subheader={`Refresh in ${Controllers.Clock.timeToNextDay}`}
          Component={ContractListItem}
          items={contracts}
        />
        <ListPreview<HangarAsset>
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
