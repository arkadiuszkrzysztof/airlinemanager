import React, { useEffect } from 'react'
import MarketListItem from './components/MarketListItem'

import { Container, Row, Col, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { type Plane } from './models/Plane'

import { AirplaneFill, CalendarWeek, CartCheck, Coin, FileEarmarkText, HouseDoor, StarFill } from 'react-bootstrap-icons'
import ListPreview from './components/widgets/ListPreview'
import { type HangarAsset } from './controllers/HangarController'
import HangarListItem from './components/HangarListItem'
import { GameController } from './controllers/GameController'
import { type Contract } from './models/Contract'
import ContractListItem from './components/ContractListItem'
import TierDetailsTooltip from './components/tooltips/TierDetailsTooltip'
import ReputationBreakdownTooltip from './components/tooltips/ReputationBreakdownTooltip'

const App: React.FC = () => {
  const Controllers = GameController.getInstance()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clock, setClock] = React.useState<number>()
  const [assets, setAssets] = React.useState<HangarAsset[]>([])
  const [market, setMarket] = React.useState<Plane[]>([])
  const [contracts, setContracts] = React.useState<Contract[]>([])

  useEffect(() => {
    setClock(Controllers.Clock.playtime)
    setAssets(Controllers.Hangar.getAllAssets())
    setMarket(Controllers.Market.getAvailablePlanes(Controllers.Clock.playtime))
    setContracts(Controllers.Contracts.getAvailableContracts(Controllers.Clock.playtime))
  }, [])

  const clockWrapper = (playtime: number): void => {
    if (playtime % 5 === 0) {
      setClock(Controllers.Clock.playtime)
    }
  }

  Controllers.Clock.registerListener('headerClockLabel', clockWrapper)
  Controllers.Clock.registerListener('marketListPreview', Controllers.Market.getAvailablePlanes)
  Controllers.Clock.registerListener('contractsListPreview', Controllers.Contracts.getAvailableContracts)
  Controllers.Clock.registerListener('eventsLog', Controllers.Schedule.registerAndExecuteEvents)

  Controllers.Hangar.registerListener('hangarListPreview', setAssets)
  Controllers.Market.registerListener('marketListPreview', setMarket)
  Controllers.Contracts.registerListener('contractsListPreview', setContracts)

  return (
    <Container fluid>
      <Row className='justify-content-center p-2 bg-secondary'>
        <Col xs={2} className='d-flex align-items-center'>
          <AirplaneFill size={12} className='text-primary me-2'/>
          <span className='text-primary'>Airline Simulator <small className='text-grey-light'>ALPHA</small></span>
        </Col>
        <Col xs={4} xl={3} className='d-flex align-items-center'>
          <OverlayTrigger placement="bottom" overlay={<Tooltip className='tooltip-large' style={{ position: 'fixed' }}><TierDetailsTooltip /></Tooltip>}>
            <Badge bg={`badge-${Controllers.Airline.getTier().name.toLocaleLowerCase()}`} className='fs-6 me-2 cursor-help'>
              {Controllers.Airline.getTier().name}
            </Badge>
          </OverlayTrigger>
          <span className='text-dark fw-bold fs-5'>{Controllers.Airline.name}</span>
        </Col>
        <Col xs={1} className='d-flex align-items-center'>
          <OverlayTrigger placement="bottom" overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><ReputationBreakdownTooltip /></Tooltip>}>
            <div className='d-flex align-items-center cursor-help'>
              <StarFill size={20} className='text-badge-gold me-2' />
              <span className='fw-bold text-dark'>{Controllers.Airline.reputationFormatted}</span>
            </div>
          </OverlayTrigger>
        </Col>
        <Col xs={2} className='d-flex align-items-center'>
          <Coin size={20} className='text-primary me-2' />
          <span className='fw-bold text-dark'>{Controllers.Airline.cashFormatted}</span>
        </Col>
        <Col xs={2} className='d-flex align-items-center'>
        <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: 'fixed' }}><strong>Total playtime:</strong><br />{Controllers.Clock.totalPlaytime}</Tooltip>}>
          <CalendarWeek size={20} className='text-primary me-2 cursor-help' />
        </OverlayTrigger>
          <Badge bg='dark' className='mx-2'>
            {Controllers.Clock.currentDayOfWeek}
          </Badge>
          <span className='fw-bold text-dark'>{Controllers.Clock.playtimeFormatted}</span>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <ListPreview<Plane>
          Icon={CartCheck}
          header='Market'
          subheader={`Refresh in ${Controllers.Clock.timeToNextWeek}`}
          Component={MarketListItem}
          items={market.sort((a, b) => a.pricing.purchase - b.pricing.purchase)}
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
          header={`Hangar (${Controllers.Hangar.getAssetsCount()}/${Controllers.Airline.getTier().record.constraints.maxPlanes})`}
          Component={HangarListItem}
          items={assets.sort((a, b) => (b.plane.acquisitionTime ?? 0) - (a.plane.acquisitionTime ?? 0))}
          fullWidth={true}
        />
      </Row>
    </Container>
  )
}

export default App
