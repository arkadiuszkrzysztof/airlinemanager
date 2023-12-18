import React from 'react'
import AboutWidget from '../widgets/AboutWidget'
import SettingsWidget from '../widgets/SettingsWidget'

const Settings: React.FC = () => {
  return (
    <>
      <SettingsWidget />
      <AboutWidget />
    </>
  )
}

export default Settings
