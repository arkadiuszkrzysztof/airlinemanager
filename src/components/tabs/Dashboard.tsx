import React from 'react'

import FlightsPreviewWidget from '../widgets/FlightsPreviewWidget'
import NotificationsWidget from '../widgets/NotificationsWidget'
import HealthcheckWidget from '../widgets/HealthcheckWidget'

const Dashboard: React.FC = () => {
  return (
    <>
      <FlightsPreviewWidget fullWidth />
      <HealthcheckWidget />
      <NotificationsWidget />
    </>
  )
}

export default Dashboard
