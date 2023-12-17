import React, { useState, type ReactElement } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'

import { Map as MapIcon } from 'react-bootstrap-icons'
import { GameController } from '../../controllers/GameController'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import { GreatCircle } from '../../controllers/helpers/GreatCircle'
import { type Map, DivIcon } from 'leaflet'
import { Regions, type Airport } from '../../models/Airport'
import { AirlineController } from '../../controllers/AirlineController'
import { ScheduleController } from '../../controllers/ScheduleController'

interface Props {
  fullWidth?: boolean
}

const MapConfig: Record<keyof typeof Regions, { center: [number, number], zoom: number }> = {
  NA: {
    center: [40, -100],
    zoom: 4
  },
  EU: {
    center: [55, 10],
    zoom: 4
  },
  ASIA: {
    center: [30, 100],
    zoom: 4
  },
  LATAM: {
    center: [-25, -60],
    zoom: 4
  },
  AFRICA: {
    center: [0, 20],
    zoom: 4
  },
  OCEANIA: {
    center: [-20, 140],
    zoom: 4
  }
}

const WORLD = 'WORLD'

const WorldMapConfig: { center: [number, number], zoom: number } = {
  center: [0, 0],
  zoom: 2
}

let MapReference: Map

const MapController: React.FC = () => {
  MapReference = useMap()
  return null
}

const MapWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const Controllers = GameController.getInstance()
  const startingRegion = Controllers.Airline.getTier().record.constraints.canFlyCrossRegion && AirlineController.getInstance().unlockedRegions.length > 1 ? WORLD : Controllers.Airline.startingRegion

  const [showAirports, setShowAirports] = useState(false)
  const [showConnections, setShowConnections] = useState(false)
  const [showInAir, setShowInAir] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [zoomedRegion, setZoomedRegion] = useState(startingRegion)

  const config = zoomedRegion === WORLD ? WorldMapConfig : MapConfig[zoomedRegion as keyof typeof Regions]

  const allAirports = Controllers.Contracts.getAirports()
  const inTheAir = Controllers.Schedule.getActiveSchedules().filter(schedule => ScheduleController.flightStatus(schedule).inTheAir)

  const getPlaneIcon = (angle: number, registration: string, showLabels: boolean): DivIcon => {
    return new DivIcon({
      html: `<img src="/images/plane.png" style="transform: rotate(${Math.floor(angle)}deg);">` + (showLabels ? `<p class='bg-warning rounded text-center opacity-75 text-white' style='margin-left: -18px'>${registration}</p>` : ''),
      className: 'plane-icon',
      iconSize: [48, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    })
  }

  const getAirportIcon = (isHub: boolean, region: string, IATACode: string, showLabels: boolean): DivIcon => {
    return new DivIcon({
      html: (isHub
        ? '<img src="/images/tower-hub.png">' + (showLabels ? `<p class='bg-primary rounded text-center opacity-75 text-white' style='margin-left: -6px; margin-top: 4px;'>${IATACode}</p>` : '')
        : AirlineController.getInstance().unlockedRegions.includes(region)
          ? '<img src="/images/tower-dest.png">' + (showLabels ? `<p class='bg-dark rounded text-center opacity-75 text-white' style='margin-left: -6px; margin-top: 4px;'>${IATACode}</p>` : '')
          : '<img src="/images/tower-inactive.png">' + (showLabels ? `<p class='bg-grey-dark rounded text-center opacity-75 text-white' style='margin-left: -6px; margin-top: 4px;'>${IATACode}</p>` : '')
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

  const AirportMarker: React.FC<{ airport: Airport, offset: number, coordinates: [number, number] }> = ({ airport, offset, coordinates }) => {
    return (
      <Marker
        position={[coordinates[0], coordinates[1] + offset]}
        icon={getAirportIcon(Controllers.Hangar.getHubs().filter(hub => hub.IATACode === airport.IATACode).length > 0, airport.region, airport.IATACode, showLabels)}>
      </Marker>
    )
  }

  return (
    <Col xs={12} md={11} xxl={10} xxxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <MapIcon size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>Destinations Map</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column widget-full-height overflow-auto p-0'>
          <Row className='m-0 p-0'>
            <Col xs={2} className='bg-dark text-white p-4'>
              <Form.Switch className='mt-2' id='show-in-air' label='Show In-Air' checked={showInAir} onChange={() => { setShowInAir(!showInAir) }} />
              <Form.Switch className='mt-2' id='show-labels' label='Show Labels' checked={showLabels} onChange={() => { setShowLabels(!showLabels) }} />
              <Form.Switch className='mt-2' id='show-airport-codes' label='Show Airports' checked={showAirports} onChange={() => { setShowAirports(!showAirports) }} />
              <Form.Switch className='mt-2' id='show-connections' label='Show Connections' checked={showConnections} onChange={() => { setShowConnections(!showConnections) }} />

              <p className='pt-4'>Zoom to Region</p>
              <img
                src={'/images/region-world.png'}
                alt={'World'}
                className={'rounded m-1 cursor-pointer'}
                style={{ maxWidth: '100px' }}
                onClick={() => { setZoomedRegion(WORLD); MapReference?.flyTo(WorldMapConfig.center, WorldMapConfig.zoom) }} />
              {Object.keys(Regions).map((key) => (
                <img
                  key={key}
                  src={`/images/region-${key.toLocaleLowerCase()}.png`}
                  alt={Regions[key as keyof typeof Regions]}
                  className={'rounded m-1 cursor-pointer'}
                  style={{ maxWidth: '50px' }}
                  onClick={() => { setZoomedRegion(key); MapReference?.flyTo(MapConfig[key as keyof typeof Regions].center, MapConfig[key as keyof typeof Regions].zoom) }} />
              ))}
            </Col>
            <Col xs={10}>
              <Row className='widget-full-height' style={{ height: 'calc(100vh - 150px)' }}>
                <MapContainer center={config.center} zoom={config.zoom} scrollWheelZoom={true}>
                  <MapController />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {[-360, 0, 360].map((offset) => {
                    return (
                      showAirports && Object.keys(allAirports).map(region => (
                        allAirports[region as keyof typeof Regions].map((airport) => (
                          <AirportMarker key={`airport-${airport.IATACode}`} airport={airport} coordinates={[airport.coordinates.latitude, airport.coordinates.longitude]} offset={offset} />
                        ))
                      ))
                    )
                  })}

                  {showConnections && getConnections().map(([hub, destination, connection]) =>
                    <Polyline
                      key={`${hub.IATACode}${destination.IATACode}`}
                      positions={GreatCircle.getPathPoints(hub.coordinates, destination.coordinates).map(point => [point.latitude, point.longitude])}
                      color="#45ADA9"
                      weight={Math.min(connection, 5)} />
                  )}

                  {showInAir && inTheAir.map((schedule) => {
                    const currentPosition = GreatCircle.getCurrentPoint(schedule)
                    const pathPoints = GreatCircle.getPathPoints(schedule.contract.hub.coordinates, schedule.contract.destination.coordinates).map(point => [point.latitude, point.longitude])

                    return (
                      <React.Fragment key={schedule.contract.id}>
                        <AirportMarker key={`airport-${schedule.contract.hub.IATACode}`} airport={schedule.contract.hub} coordinates={pathPoints[0] as [number, number]} offset={0} />
                        <AirportMarker key={`airport-${schedule.contract.destination.IATACode}`} airport={schedule.contract.destination} coordinates={pathPoints[pathPoints.length - 1] as [number, number]} offset={0} />
                        <Polyline
                          key={schedule.contract.id}
                          positions={pathPoints as Array<[number, number]>}
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
