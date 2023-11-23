import React from 'react'

import { type Contract } from '../models/Contract'
import { type Controllers } from '../controllers/GameController'
import FlightsPreview from '../components/widgets/FlightsPreview'

interface Props {
  contracts: Contract[]
  Controllers: Controllers
}

const Dashboard: React.FC<Props> = ({ Controllers }) => {
  return (
    <>
      <FlightsPreview Controllers={Controllers} fullWidth />
    </>
  )
}

export default Dashboard
