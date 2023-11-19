import React from 'react'
import { type HangarAsset } from '../../controllers/HangarController'
import { Col, Row } from 'react-bootstrap'

const PlaneDetailsTooltip: React.FC<{ asset: HangarAsset }> = ({ asset }) => {
  const { plane, ownership } = asset

  return (
    <>
      <strong>{`${plane.familyName} ${plane.typeName}`}</strong>
      <Row>
        <Col xs={7} className='text-start'>Registration</Col>
        <Col xs={5} className='text-end'>{plane.registration}</Col>
      </Row>
      <Row>
        <Col xs={7} className='text-start'>Ownership</Col>
        <Col xs={5} className='text-end'>{ownership}</Col>
        </Row>
      <Row>
        <Col xs={7} className='text-start'>Max range</Col>
        <Col xs={5} className='text-end'>{plane.maxRange} km</Col>
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
