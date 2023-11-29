import React from 'react'

import { type Controllers } from '../controllers/GameController'
import MapWidget from '../components/widgets/MapWidget'

interface Props {
  Controllers: Controllers
}

const Dashboard: React.FC<Props> = ({ Controllers }) => {
  return (
    <>
      <MapWidget Controllers={Controllers} fullWidth />
    </>
  )
}

export default Dashboard
