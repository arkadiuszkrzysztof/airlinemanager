import React from 'react'

import { type Controllers } from '../controllers/GameController'
import FlightsPreview from '../components/widgets/FlightsPreview'
import PNLPreview from '../components/widgets/PNLPreview'
import NotificationsWidget from '../components/widgets/NotificationsWidget'

interface Props {
  Controllers: Controllers
}

const Dashboard: React.FC<Props> = ({ Controllers }) => {
  return (
    <>
      <FlightsPreview Controllers={Controllers} fullWidth />
      <PNLPreview Controllers={Controllers} />
      <NotificationsWidget Controllers={Controllers} />
    </>
  )
}

export default Dashboard
