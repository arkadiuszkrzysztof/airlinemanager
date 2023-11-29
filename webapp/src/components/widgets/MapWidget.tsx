import React, { type ReactElement } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'

import { type Controllers } from '../../controllers/GameController'
import { Map } from 'react-bootstrap-icons'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import { GreatCircle } from '../../controllers/helpers/GreatCircle'
import { flightStatus } from '../../controllers/helpers/Helpers'
import { DivIcon } from 'leaflet'
import { type Airport } from '../../models/Airport'

interface Props {
  Controllers: Controllers
  fullWidth?: boolean
}

const MapWidget: React.FC<Props> = ({ Controllers, fullWidth = false }): ReactElement => {
  const [showAirports, setShowAirports] = React.useState<boolean>(true)
  const [showConnections, setShowConnections] = React.useState<boolean>(false)
  const [showInAir, setShowInAir] = React.useState<boolean>(true)
  const [showLabels, setShowLabels] = React.useState<boolean>(true)

  const getPlaneIcon = (angle: number, registration: string, showLabels: boolean): DivIcon => {
    return new DivIcon({
      html: `<img src="/images/plane.png" style="transform: rotate(${Math.floor(angle)}deg);">` + (showLabels ? `<p class='bg-warning rounded text-center opacity-75 text-white' style='margin-left: -18px'>${registration}</p>` : ''),
      className: 'plane-icon',
      iconSize: [48, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    })
  }

  const getAirportIcon = (isHub: boolean, IATACode: string, showLabels: boolean): DivIcon => {
    return new DivIcon({
      html: (isHub
        ? '<img src="/images/tower-hub.png">' + (showLabels ? `<p class='bg-primary rounded text-center opacity-75 text-white' style='margin-left: -6px; margin-top: 4px;'>${IATACode}</p>` : '')
        : '<img src="/images/tower-dest.png">' + (showLabels ? `<p class='bg-dark rounded text-center opacity-75 text-white' style='margin-left: -6px; margin-top: 4px;'>${IATACode}</p>` : '')
      ),
      className: 'plane-icon',
      iconSize: [30, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    })
  }

  const getConnections = (): Array<[hub: Airport, destination: Airport, connections: number]> => {
    const connections: Array<[hub: Airport, destination: Airport, connections: number]> = []

    Controllers.Schedule.getActiveSchedules().forEach((schedule) => {
      const hub = schedule.contract.hub
      const destination = schedule.contract.destination

      const existingConnection = connections.find(connection =>
        (connection[0].IATACode === hub.IATACode && connection[1].IATACode === destination.IATACode) ||
        (connection[0].IATACode === destination.IATACode && connection[1].IATACode === hub.IATACode))

      if (existingConnection !== undefined) {
        existingConnection[2]++
      } else {
        connections.push([hub, destination, 1])
      }
    })

    return connections
  }

  const getHubs = (): Set<string> => {
    const hubs = new Set<string>()

    Controllers.Hangar.getAllAssets().forEach((asset) => {
      if (asset.plane.hub !== undefined) {
        hubs.add(asset.plane.hub.IATACode)
      }
    })

    return hubs
  }

  return (
    <Col xs={12} md={11} xxl={10} xxxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <Map size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>Destinations Map</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-800 overflow-auto p-0'>
          <Row className='m-0 p-0' style={{ height: '800px' }}>
            <Col xs={2} className='bg-dark text-white'>
              <Form.Switch className='mt-2' id='show-airport-codes' label='Show Airports' checked={showAirports} onChange={() => { setShowAirports(!showAirports) }} />
              <Form.Switch className='mt-2' id='show-in-air' label='Show In-Air' checked={showInAir} onChange={() => { setShowInAir(!showInAir) }} />
              <Form.Switch className='mt-2' id='show-labels' label='Show Labels' checked={showLabels} onChange={() => { setShowLabels(!showLabels) }} />
              <Form.Switch className='mt-2' id='show-connections' label='Show Connections' checked={showConnections} onChange={() => { setShowConnections(!showConnections) }} />
            </Col>
            <Col xs={10}>
              <Row style={{ height: '800px' }}>
                <MapContainer center={[55, 10]} zoom={4} scrollWheelZoom={true}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {showAirports && Controllers.Contracts.getAirports().map((airport) => {
                    const hubs = getHubs()

                    return (
                    <Marker
                      key={`airport-${airport.IATACode}`}
                      position={[airport.coordinates.latitude, airport.coordinates.longitude]}
                      icon={getAirportIcon(hubs.has(airport.IATACode), airport.IATACode, showLabels)}>
                    </Marker>
                    )
                  })}

                  {showConnections && getConnections().map(([hub, destination, connection]) =>
                    <Polyline
                      key={`${hub.IATACode}${destination.IATACode}`}
                      positions={GreatCircle.getPathPoints(hub.coordinates, destination.coordinates).map(point => [point.latitude, point.longitude])}
                      color="#45ADA9"
                      weight={Math.min(connection, 5)} />
                  )}

                  {showInAir && Controllers.Schedule.getActiveSchedules().filter(schedule => flightStatus(schedule).inTheAir).map((schedule) => {
                    const currentPosition = GreatCircle.getCurrentPoint(schedule)

                    return (
                      <React.Fragment key={schedule.contract.id}>
                        <Polyline
                          key={schedule.contract.id}
                          positions={GreatCircle.getPathPoints(schedule.contract.hub.coordinates, schedule.contract.destination.coordinates).map(point => [point.latitude, point.longitude])}
                          color="#D58C3A"
                          weight={2}/>
                        <Marker
                          key={`contract-${schedule.contract.id}`}
                          position={[currentPosition.coordinates.latitude, currentPosition.coordinates.longitude]}
                          icon={getPlaneIcon(currentPosition.angle, schedule.option.asset.plane.registration, showLabels)} />
                      </React.Fragment>
                    )
                  })}
                </MapContainer>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default MapWidget
