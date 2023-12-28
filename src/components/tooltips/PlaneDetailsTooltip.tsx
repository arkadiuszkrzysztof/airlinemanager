import React from 'react'
import { type HangarAsset } from '../../controllers/HangarController'
import { Col, Row } from 'react-bootstrap'
import { GameController } from '../../controllers/GameController'

const PlaneDetailsTooltip: React.FC<{ asset: HangarAsset }> = ({ asset }) => {
  const { plane, ownership } = asset

  return (
    <>
      <strong>{`${plane.familyName} ${plane.typeName}`}</strong>
      <Row>
        <Col xs={7} className='text-start'>Hub</Col>
        <Col xs={5} className='text-end'>{plane.hub !== undefined ? `${plane.hub.location} (${plane.hub.countryCode})` : 'None'}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Registration</Col>
        <Col xs={5} className='text-end'>{plane.registration}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Ownership</Col>
        <Col xs={5} className='text-end'>{ownership}</Col>
      </Row>
      <Row>
        <Col xs={4} className='text-start'>Age</Col>
        <Col xs={8} className='text-end'>{plane.age}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Reputation</Col>
        <Col xs={5} className='text-end'>{`+${plane.reputation.toFixed(2)}%`}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Max range</Col>
        <Col xs={5} className='text-end'>{GameController.formatDistance(plane.maxRange)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Cruise speed</Col>
        <Col xs={5} className='text-end'>{GameController.formatSpeed(plane.cruiseSpeed)}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Min runway</Col>
        <Col xs={5} className='text-end'>{`${plane.minRunwayLength} meters`}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Plane capacity:</Col>
        <Col xs={5} className='text-end'></Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>- Economy Class</Col>
        <Col xs={5} className='text-end'>{plane.maxSeating.economy}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>- Business Class</Col>
        <Col xs={5} className='text-end'>{plane.maxSeating.business}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>- First Class</Col>
        <Col xs={5} className='text-end'>{plane.maxSeating.first}</Col>
      </Row>
    </>
  )
}

export default PlaneDetailsTooltip
