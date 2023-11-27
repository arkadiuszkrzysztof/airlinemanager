import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { type Plane } from './models/Plane'
import { type Contract } from './models/Contract'
import { type HangarAsset } from './controllers/HangarController'
import { GameController } from './controllers/GameController'
import Layout from './Layout'
import Operations from './tabs/Operations'
import Dashboard from './tabs/Dashboard'

const App: React.FC = () => {
  const Controllers = GameController.getInstance()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clock, setClock] = React.useState<number>()
  const [assets, setAssets] = React.useState<HangarAsset[]>([])
  const [market, setMarket] = React.useState<Plane[]>([])
  const [contracts, setContracts] = React.useState<Contract[]>([])

  useEffect(() => {
    setClock(Controllers.Clock.playtime)
    setAssets(Controllers.Hangar.getAllAssets())
    setMarket(Controllers.Market.getAvailablePlanes(Controllers.Clock.playtime))
    setContracts(Controllers.Contracts.getAvailableContracts(Controllers.Clock.playtime))
  }, [])

  const clockWrapper = (playtime: number): void => {
    if (playtime % 15 === 0) {
      setClock(Controllers.Clock.playtime)
    }
  }

  Controllers.Clock.registerListener('headerClockLabel', clockWrapper)
  Controllers.Clock.registerListener('marketListPreview', Controllers.Market.getAvailablePlanes)
  Controllers.Clock.registerListener('contractsListPreview', Controllers.Contracts.getAvailableContracts)
  Controllers.Clock.registerListener('eventsLog', Controllers.Schedule.registerAndExecuteEvents)

  Controllers.Hangar.registerListener('hangarListPreview', setAssets)
  Controllers.Market.registerListener('marketListPreview', setMarket)
  Controllers.Contracts.registerListener('contractsListPreview', setContracts)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout Controllers={Controllers} />}>
          <Route path="/dashboard" element={<Dashboard contracts={contracts} Controllers={Controllers} />} />
          <Route path="/operations" element={<Operations assets={assets} market={market} contracts={contracts} Controllers={Controllers} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
