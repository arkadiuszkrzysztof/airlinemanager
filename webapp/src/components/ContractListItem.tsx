/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { type Contract } from '../models/Contract'
import { Row, Col, Button } from 'react-bootstrap'
import { GameController } from '../controllers/GameController'
import { type HangarAsset } from '../controllers/HangarController'

interface Props {
  item: Contract
}

const ContractListItem: React.FC<Props> = ({ item: contract }) => {
  const Controllers = GameController.getInstance()

  const calculateCost = (asset: HangarAsset): number => {
    const econonyPassengers = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
    const businessPassengers = Math.min(contract.demand.business, asset.plane.maxSeating.business)
    const firstPassengers = Math.min(contract.demand.first, asset.plane.maxSeating.first)

    const duration = contract.distance / asset.plane.cruiseSpeed
    const fuelCost = asset.plane.fuelConsumption * duration
    const maintenanceCost = asset.plane.pricing.maintenance * duration
    const leasingCost = asset.plane.pricing.lease * duration
    const passengerFee = (econonyPassengers + businessPassengers + firstPassengers) * contract.hub.fees.passenger + (econonyPassengers + businessPassengers + firstPassengers) * contract.destination.fees.passenger
    const landingFee = contract.hub.fees.landing * asset.plane.MTOW * 2 + contract.destination.fees.landing * asset.plane.MTOW * 2

    return Math.floor(fuelCost * 2 + maintenanceCost * 2 + leasingCost * 2 + passengerFee + landingFee)
  }

  const calculateRevenue = (asset: HangarAsset): number => {
    const econonyPassengers = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
    const businessPassengers = Math.min(contract.demand.business, asset.plane.maxSeating.business)
    const firstPassengers = Math.min(contract.demand.first, asset.plane.maxSeating.first)

    const duration = contract.distance / asset.plane.cruiseSpeed

    return Math.floor((econonyPassengers * 300 + businessPassengers * 900 + firstPassengers * 1500) * duration * 2)
  }

  const calculateUtilization = (asset: HangarAsset): number => {
    const econonyPassengers = Math.min(contract.demand.economy, asset.plane.maxSeating.economy)
    const businessPassengers = Math.min(contract.demand.business, asset.plane.maxSeating.business)
    const firstPassengers = Math.min(contract.demand.first, asset.plane.maxSeating.first)

    return Math.floor((econonyPassengers + businessPassengers + firstPassengers) / (asset.plane.maxSeating.economy + asset.plane.maxSeating.business + asset.plane.maxSeating.first) * 100)
  }

  const calculateTurnaround = (asset: HangarAsset): string => {
    const duration = contract.distance / asset.plane.cruiseSpeed
    const turnaround = (asset.plane.maxSeating.economy + asset.plane.maxSeating.business + asset.plane.maxSeating.first) / 200
    const time = (duration * 2 + turnaround) * 60
    return Math.floor(time / 60) + 'h ' + Math.floor(time % 60) + 'm'
  }

  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <div>{`${contract.hub.IATACode} <-> ${contract.destination.IATACode} (${contract.distance} km) <-> ${contract.hub.IATACode}`}</div>
      <div>{`${contract.dayOfWeek} ${JSON.stringify(contract.demand)}`}</div>
      {Controllers.Hangar.getAllAssets().map((asset) => (
        <Row key={asset.plane.registration}>
          <Col xs={2}>{asset.plane.registration} <Button variant='primary'>Accept</Button></Col>
          <Col xs={2}>Cost: {calculateCost(asset).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</Col>
          <Col xs={2}>Revenue: {calculateRevenue(asset).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</Col>
          <Col xs={2}>Profit: {(calculateRevenue(asset) - calculateCost(asset)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</Col>
          <Col xs={2}>Utilization: {calculateUtilization(asset)}%</Col>
          <Col xs={2}>Turnaround: {calculateTurnaround(asset)}</Col>

        </Row>
      ))}
    </Row>
  )
}

export default ContractListItem
