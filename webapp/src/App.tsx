import React from 'react'
import MarketListItem from './components/MarketListItem'

import { Container, Row, Col, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { type Plane } from './models/Plane'

import { AirplaneFill, CalendarWeek, CartCheck, Coin, FileEarmarkText, GraphUpArrow, HouseDoor } from 'react-bootstrap-icons'
import ListPreview from './components/widgets/ListPreview'
import { type HangarAsset } from './controllers/HangarController'
import HangarListItem from './components/HangarListItem'
import { GameController } from './controllers/GameController'
import { type Contract } from './models/Contract'
import ContractListItem from './components/ContractListItem'

const App: React.FC = () => {
  const Controllers = GameController.getInstance()
  const [clock, setClock] = React.useState(Controllers.Clock.playtime)
  const [assets, setAssets] = React.useState<HangarAsset[]>(Controllers.Hangar.getAllAssets())
  const [market, setMarket] = React.useState<Plane[]>(Controllers.Market.getAvailablePlanes(clock))
  const [contracts, setContracts] = React.useState(Controllers.Contracts.getAvailableContracts(clock))

  Controllers.Clock.registerListener('headerClockLabel', setClock)
  Controllers.Clock.registerListener('marketListPreview', Controllers.Market.getAvailablePlanes)
  Controllers.Clock.registerListener('contractsListPreview', Controllers.Contracts.getAvailableContracts)
  Controllers.Hangar.registerListener('hangarListPreview', setAssets)
  Controllers.Market.registerListener('marketListPreview', setMarket)
  Controllers.Contracts.registerListener('contractsListPreview', setContracts)

  return (
    <Container fluid>
      <Row className='justify-content-center p-2 bg-secondary'>
        <Col xs={2} className='d-flex align-items-center'>
          <AirplaneFill size={12} className='text-primary me-2'/>
          <span className='text-primary'>Airline Simulator</span>
        </Col>
        <Col xs={4} xl={3} className='d-flex align-items-center'>
          <Badge
            bg={`badge-${Object.keys(Controllers.Airline.getTier())[0].toLocaleLowerCase()}`}
            className='fs-6 me-2'
          >
            {Object.keys(Controllers.Airline.getTier())}
          </Badge>
          <span className='text-dark fw-bold fs-5'>{Controllers.Airline.name}</span>
        </Col>
        <Col xs={1} className='d-flex align-items-center'>
          <GraphUpArrow size={20} className='text-primary me-2' />
          <span className='fw-bold text-primary'>{Controllers.Airline.reputation}</span>
        </Col>
        <Col xs={2} className='d-flex align-items-center'>
          <Coin size={20} className='text-primary me-2' />
          Cash:&nbsp;<span className='fw-bold text-primary'>{Controllers.Airline.cash}</span>
        </Col>
        <Col xs={2} className='d-flex align-items-center'>
        <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: 'fixed' }}><strong>Total playtime:</strong><br />{Controllers.Clock.totalPlaytime}</Tooltip>}>
          <CalendarWeek size={20} className='text-primary me-2' role='button' />
        </OverlayTrigger>
          <Badge bg='dark' className='mx-2'>
            {Controllers.Clock.currentDayOfWeek}
          </Badge>
          <span className='fw-bold text-primary'>{Controllers.Clock.playtimeFormatted}</span>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <ListPreview<Plane>
          Icon={CartCheck}
          header='Market'
          subheader={`Refresh in ${Controllers.Clock.timeToNextWeek}`}
          Component={MarketListItem}
          items={market}
        />
        <ListPreview<Contract>
          Icon={FileEarmarkText}
          header='Contracts'
          subheader={`Refresh in ${Controllers.Clock.timeToNextDay}`}
          Component={ContractListItem}
          items={contracts}
        />
        <ListPreview<HangarAsset>
          Icon={HouseDoor}
          header='Hangar'
          Component={HangarListItem}
          items={assets}
          fullWidth={true}
        />
      </Row>
    </Container>
  )
}

export default App
