import React from 'react'

import { type Controllers } from '../../controllers/GameController'
import FlightsPreviewWidget from '../widgets/FlightsPreviewWidget'
import PNLWidget from '../widgets/PNLWidget'
import NotificationsWidget from '../widgets/NotificationsWidget'

interface Props {
  Controllers: Controllers
}

const Dashboard: React.FC<Props> = ({ Controllers }) => {
  return (
    <>
      <FlightsPreviewWidget Controllers={Controllers} fullWidth />
      <PNLWidget Controllers={Controllers} />
      <NotificationsWidget Controllers={Controllers} />
    </>
  )
}

export default Dashboard
