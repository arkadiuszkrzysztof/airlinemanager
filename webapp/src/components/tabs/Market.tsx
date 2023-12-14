import React, { useEffect } from 'react'

import { AirplaneEngines, FileEarmarkText } from 'react-bootstrap-icons'
import { type Plane } from '../../models/Plane'
import { type Contract } from '../../models/Contract'
import ListPreviewWidget from '../widgets/ListPreviewWidget'
import MarketListItem from '../widgets/listitems/MarketListItem'
import ContractListItem from '../widgets/listitems/ContractListItem'
import { GameController } from '../../controllers/GameController'
import { type ContractOption } from '../../controllers/ContractsController'
import ContractsFilter from '../fragments/ContractsFilter'
import { type HangarAsset } from '../../controllers/HangarController'

const Market: React.FC = () => {
  const Controllers = GameController.getInstance()

  const [market, setMarket] = React.useState<Plane[]>([])
  const [contracts, setContracts] = React.useState<Array<{ contract: Contract, options: ContractOption[] }>>([])
  const [, setAssets] = React.useState<HangarAsset[]>([])

  useEffect(() => {
    setMarket(Controllers.Market.getAvailablePlanes(Controllers.Clock.playtime))
    setContracts(Controllers.Contracts.getAvailableContracts(Controllers.Clock.playtime))
    setAssets(Controllers.Hangar.getAllAssets())
  }, [])

  Controllers.Market.registerListener('marketListPreview', setMarket)
  Controllers.Contracts.registerListener('contractsListPreview', setContracts)
  Controllers.Hangar.registerListener('hangarListPreview', setAssets)

  return (
    <>
      <ListPreviewWidget<Plane>
          Icon={AirplaneEngines}
          header={`Planes (${Controllers.Hangar.getAssetsCount()}/${Controllers.Airline.getTier().record.constraints.maxPlanes})`}
          subheader={`Refresh in ${Controllers.Clock.timeToNextWeek}`}
          Component={MarketListItem}
          items={market.sort((a, b) => b.reputation - a.reputation)}
          fullHeight
        />
        <ListPreviewWidget<{ contract: Contract, options: ContractOption[] }>
          Icon={FileEarmarkText}
          header='Contracts'
          subheader={`Refresh in ${Controllers.Clock.timeToNextDay}`}
          Component={ContractListItem}
          items={contracts}
          FilterSection={ContractsFilter}
          fullHeight
        />
    </>
  )
}

export default Market