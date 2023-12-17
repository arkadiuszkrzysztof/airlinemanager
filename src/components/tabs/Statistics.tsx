import React, { useEffect } from 'react'

import PNLWidget from '../widgets/PNLWidget'
import PassengersWidget from '../widgets/PassengersWidget'
import DestinationsWidget from '../widgets/DestinationsWidget'
import ConnectionsWidget from '../widgets/ConnectionsWidget'
import { AirlineController, type PNLRecord } from '../../controllers/AirlineController'

const Statistics: React.FC = () => {
  const [pnlData, setPnlData] = React.useState<Record<number, PNLRecord>>({})

  AirlineController.getInstance().registerPNLListener('statistics', setPnlData)

  useEffect(() => {
    setPnlData(AirlineController.getInstance().PNL)
  }, [])

  return (
    <>
      <PNLWidget data={{ ...pnlData }} />
      <PassengersWidget data={{ ...pnlData }} />
      <ConnectionsWidget data={{ ...pnlData }} />
      <DestinationsWidget data={{ ...pnlData }} />
    </>
  )
}

export default Statistics
