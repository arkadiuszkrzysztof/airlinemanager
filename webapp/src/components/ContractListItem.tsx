/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { type Contract } from '../models/Contract'
import { Row, Col, Button } from 'react-bootstrap'
import { GameController } from '../controllers/GameController'

interface Props {
  item: Contract
}

const ContractListItem: React.FC<Props> = ({ item: contract }) => {
  const Controllers = GameController.getInstance()

  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <div>{`${contract.hub.IATACode} <-> ${contract.destination.IATACode} (${contract.distance} km)`}</div>
    </Row>
  )
}

export default ContractListItem
