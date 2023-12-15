import React from 'react'

import FlightsPreviewWidget from '../widgets/FlightsPreviewWidget'
import NotificationsWidget from '../widgets/NotificationsWidget'

const Dashboard: React.FC = () => {
  return (
    <>
      <FlightsPreviewWidget fullWidth />
      <NotificationsWidget />
    </>
  )
}

export default Dashboard
