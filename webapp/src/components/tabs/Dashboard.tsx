import React from 'react'

import FlightsPreviewWidget from '../widgets/FlightsPreviewWidget'
import PNLWidget from '../widgets/PNLWidget'
import NotificationsWidget from '../widgets/NotificationsWidget'

const Dashboard: React.FC = () => {
  return (
    <>
      <FlightsPreviewWidget fullWidth />
      <PNLWidget />
      <NotificationsWidget />
    </>
  )
}

export default Dashboard
