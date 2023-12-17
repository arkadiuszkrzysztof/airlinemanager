import React from 'react'

import PNLWidget from '../widgets/PNLWidget'
import PassengersWidget from '../widgets/PassengersWidget'
import DestinationsWidget from '../widgets/DestinationsWidget'
import ConnectionsWidget from '../widgets/ConnectionsWidget'

const Statistics: React.FC = () => {
  return (
    <>
      <PNLWidget />
      <PassengersWidget />
      <ConnectionsWidget />
      <DestinationsWidget />
    </>
  )
}

export default Statistics
