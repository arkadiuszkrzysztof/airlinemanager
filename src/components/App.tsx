import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Container, Row, Col, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { AirplaneEnginesFill, CashStack, PauseFill, PlayFill, StarFill } from 'react-bootstrap-icons'

import { GameController } from '../controllers/GameController'
import TierDetailsTooltip from './tooltips/TierDetailsTooltip'
import ReputationBreakdownTooltip from './tooltips/ReputationBreakdownTooltip'
import { Clock } from '../controllers/helpers/Clock'
import { LocalStorage } from '../controllers/helpers/LocalStorage'

interface Props {
  Tab: React.FC
}

const App: React.FC<Props> = ({ Tab }) => {
  const Controllers = GameController.getInstance()

  const [clock, setClock] = React.useState<number>()
  const [isPaused, setIsPaused] = React.useState<boolean>(false)
  const [airlineName, setAirlineName] = React.useState<string>(Controllers.Airline.name)

  useEffect(() => {
    setClock(Controllers.Clock.playtime)
  }, [])

  const clockWrapper = (playtime: number): void => {
    if (playtime % 15 === 0) {
      setClock(Controllers.Clock.playtime)
    }
  }

  Controllers.Clock.registerListener('headerClockLabel', clockWrapper)
  Controllers.Clock.registerListener('marketListPreview', Controllers.Market.getAvailablePlanes)
  Controllers.Clock.registerListener('contractsListPreview', Controllers.Contracts.getAvailableContracts)
  Controllers.Clock.registerListener('eventsLog', Controllers.Schedule.registerAndExecuteEvents)
  Controllers.Airline.registerNameListener('headerAirlineName', setAirlineName)

  const togglePause = (): void => {
    if (isPaused) {
      Controllers.Clock.resumeGame()
    } else {
      Controllers.Clock.pauseGame()
    }

    setIsPaused(!isPaused)
    LocalStorage.getAllAsJSON()
  }

  return (
    <Container fluid>
      <Row className='justify-content-center p-2'>
        <Col xs={12} xxl={10} className='d-flex align-items-center'>
          <Row className='w-100 justify-content-between'>
            <Col xs={'auto'} className='d-flex align-items-center overflow-hidden'>
              <AirplaneEnginesFill size={32} className='text-primary mx-2 rotate-30' />
              <span className='text-dark fw-bold fs-2'>{airlineName}</span>
            </Col>
            <Col xs={'auto'} className='p-0'>
              <Row className='my-1 justify-content-end'>
                <Col xs={'auto'} className='d-flex align-items-center'>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip className='tooltip-large' style={{ position: 'fixed' }}><TierDetailsTooltip /></Tooltip>}>
                    <Badge bg={`badge-${Controllers.Airline.getTier().name.toLocaleLowerCase()}`} className='fs-6 text-white me-2 cursor-help'>
                      {Controllers.Airline.getTier().name}
                    </Badge>
                  </OverlayTrigger>
                </Col>
                <Col xs={'auto'} className='d-flex align-items-center'>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><ReputationBreakdownTooltip /></Tooltip>}>
                    <div className='d-flex align-items-center cursor-help'>
                      <StarFill size={20} className='text-badge-gold me-2' />
                      <span className='fw-bold text-dark me-2'>{Controllers.Airline.reputationFormatted}</span>
                    </div>
                  </OverlayTrigger>
                </Col>
                <Col xs={'auto'} className='d-flex align-items-center'>
                  <CashStack size={20} className='text-primary me-2' />
                  <span className='fw-bold text-dark me-2'>{Controllers.Airline.cashFormatted}</span>
                </Col>
                <Col xs={'auto'} className='d-flex align-items-center'>
                <OverlayTrigger placement="bottom" overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><strong>Total playtime:</strong><br />{Controllers.Clock.totalPlaytime}<br /><br /><strong>In real time:</strong><br />{Controllers.Clock.totalPlaytimeInRealTime}</Tooltip>}>
                  <div className='d-flex align-items-center cursor-help'>
                    <Badge bg='dark' className='mx-2'>
                      {Controllers.Clock.currentDayOfWeek}
                    </Badge>
                    <span className='fw-bold text-dark' style={{ minWidth: '50px' }}>{Clock.getFormattedHourlyTime(clock ?? 0, true)}</span>
                  </div>
                </OverlayTrigger>
                  {isPaused
                    ? <PlayFill onClick={togglePause} size={20} className='text-primary ms-1 cursor-pointer' />
                    : <PauseFill onClick={togglePause} size={20} className='text-primary ms-1 cursor-pointer' />
                  }
                </Col>
              </Row>
              <Row className='justify-content-end py-1 mb-1'>
                <Col xs={'auto'} className='text-center widget-shadow bg-primary px-4 py-1'>
                  <NavLink to='/dashboard' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Dashboard</NavLink>
                  <NavLink to='/market' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Market</NavLink>
                  <NavLink to='/hangar' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Hangar</NavLink>
                  <NavLink to='/missions' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Missions</NavLink>
                  <NavLink to='/map' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Map</NavLink>
                  <NavLink to='/statistics' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Statistics</NavLink>
                  <NavLink to='/manual' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Manual</NavLink>
                  <NavLink to='/settings' className={({ isActive }) => `text-decoration-none text-white ${isActive ? 'fw-bold' : ''}`}>Settings</NavLink>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Tab />
      </Row>
    </Container>
  )
}

export default App
