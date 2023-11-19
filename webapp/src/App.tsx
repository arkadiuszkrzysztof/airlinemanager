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
import { formatPercentageValue } from './controllers/helpers/Helpers'

const App: React.FC = () => {
  const Controllers = GameController.getInstance()
  const [clock, setClock] = React.useState(Controllers.Clock.playtime)
  const [assets, setAssets] = React.useState<HangarAsset[]>(Controllers.Hangar.getAllAssets())
  const [market, setMarket] = React.useState<Plane[]>(Controllers.Market.getAvailablePlanes(clock))
  const [contracts, setContracts] = React.useState(Controllers.Contracts.getAvailableContracts(clock))

  Controllers.Clock.registerListener('headerClockLabel', setClock)
  Controllers.Clock.registerListener('marketListPreview', Controllers.Market.getAvailablePlanes)
  Controllers.Clock.registerListener('contractsListPreview', Controllers.Contracts.getAvailableContracts)
  Controllers.Clock.registerListener('eventsLog', Controllers.Schedule.executeEvents)

  Controllers.Hangar.registerListener('hangarListPreview', setAssets)
  Controllers.Market.registerListener('marketListPreview', setMarket)
  Controllers.Contracts.registerListener('contractsListPreview', setContracts)

  const TooltipReputation: React.FC = () => {
    const tier = Controllers.Airline.getTier()
    const nextTier = Controllers.Airline.getNextTier()

    return (
      <>
        <strong>Tier summary:</strong><br />
        <Row>
          <Col xs={6} className='text-start'></Col>
          <Col xs={3} className='text-end'>{tier.name}</Col>
          <Col xs={3} className='text-end'>{nextTier !== undefined ? nextTier.name : ''}</Col>
        </Row>
        <Row>
          <Col xs={6} className='text-start'>Maximum Take-Off Weight</Col>
          <Col xs={3} className='text-end'>{`${tier.record.constraints.MTOW} t`}</Col>
          {nextTier !== undefined
            ? <Col xs={3} className='text-end text-primary fw-bold'>{`${nextTier.record.constraints.MTOW} t`}</Col>
            : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
        </Row>
        <Row>
          <Col xs={6} className='text-start'>Max planes in hangar</Col>
          <Col xs={3} className='text-end'>{tier.record.constraints.maxPlanes}</Col>
          {nextTier !== undefined
            ? <Col xs={3} className='text-end text-primary fw-bold'>{nextTier.record.constraints.maxPlanes}</Col>
            : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
        </Row>
        <Row>
          <Col xs={6} className='text-start'>Reputation gain speed</Col>
          <Col xs={3} className='text-end'>{formatPercentageValue(tier.record.constraints.reputationGain)}</Col>
          {nextTier !== undefined
            ? <Col xs={3} className='text-end text-danger fw-bold'>{formatPercentageValue(nextTier.record.constraints.reputationGain)}</Col>
            : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
        </Row>
        <Row>
          <Col xs={6} className='text-start'>Hub discount</Col>
          <Col xs={3} className='text-end'>{formatPercentageValue(tier.record.perks.hubDiscount)}</Col>
          {nextTier !== undefined
            ? <Col xs={3} className='text-end text-primary fw-bold'>{formatPercentageValue(nextTier.record.perks.hubDiscount)}</Col>
            : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
        </Row>
        <Row>
          <Col xs={6} className='text-start'>Destination discount</Col>
          <Col xs={3} className='text-end'>{formatPercentageValue(tier.record.perks.destinationDiscount)}</Col>
          {nextTier !== undefined
            ? <Col xs={3} className='text-end text-primary fw-bold'>{formatPercentageValue(nextTier.record.perks.destinationDiscount)}</Col>
            : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
        </Row>
        <Row>
          <Col xs={6} className='text-start'>Market discount</Col>
          <Col xs={3} className='text-end'>{formatPercentageValue(tier.record.perks.marketDiscount)}</Col>
          {nextTier !== undefined
            ? <Col xs={3} className='text-end text-primary fw-bold'>{formatPercentageValue(nextTier.record.perks.marketDiscount)}</Col>
            : <Col xs={3} className='text-end text-grey-dark'>MAX</Col>}
        </Row>
      </>
    )
  }

  return (
    <Container fluid>
      <Row className='justify-content-center p-2 bg-secondary'>
        <Col xs={2} className='d-flex align-items-center'>
          <AirplaneFill size={12} className='text-primary me-2'/>
          <span className='text-primary'>Airline Simulator <small className='text-grey-light'>ALPHA</small></span>
        </Col>
        <Col xs={4} xl={3} className='d-flex align-items-center'>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip className='tooltip-large' style={{ position: 'fixed' }}><TooltipReputation /></Tooltip>}
          >
            <Badge
              bg={`badge-${Controllers.Airline.getTier().name.toLocaleLowerCase()}`}
              className='fs-6 me-2 cursor-help'
            >
              {Controllers.Airline.getTier().name}
            </Badge>
          </OverlayTrigger>
          <span className='text-dark fw-bold fs-5'>{Controllers.Airline.name}</span>
        </Col>
        <Col xs={1} className='d-flex align-items-center'>
          <GraphUpArrow size={20} className='text-primary me-2' />
          <span className='fw-bold text-dark'>{Controllers.Airline.reputation}</span>
        </Col>
        <Col xs={2} className='d-flex align-items-center'>
          <Coin size={20} className='text-primary me-2' />
          <span className='fw-bold text-dark'>{Controllers.Airline.cash}</span>
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
          items={assets}
          fullWidth={true}
        />
      </Row>
    </Container>
  )
}

export default App
