import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Container, Row, Col, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { AirplaneFill, CalendarWeek, CashStack, FileEarmarkArrowDownFill, PauseFill, PlayFill, StarFill, TrashFill } from 'react-bootstrap-icons'

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
      <Row className='justify-content-center p-2 bg-secondary'>
        <Col xs={2} className='d-flex align-items-center'>
          <AirplaneFill size={12} className='text-primary me-2'/>
          <span className='text-primary'>Airline Simulator <small className='text-grey-light'>BETA</small></span>
        </Col>
        <Col xs={3} className='d-flex align-items-center'>
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
          <CashStack size={20} className='text-primary me-2' />
          <span className='fw-bold text-dark'>{Controllers.Airline.cashFormatted}</span>
        </Col>
        <Col xs={2} className='d-flex align-items-center'>
        <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: 'fixed' }}><strong>Total playtime:</strong><br />{Controllers.Clock.totalPlaytime}</Tooltip>}>
          <CalendarWeek size={20} className='text-primary me-2 cursor-help' />
        </OverlayTrigger>
          <Badge bg='dark' className='mx-2'>
            {Controllers.Clock.currentDayOfWeek}
          </Badge>
          <span className='fw-bold text-dark'>{Clock.getFormattedHourlyTime(clock ?? 0, true)}</span>
          {isPaused
            ? <PlayFill onClick={togglePause} size={20} className='text-warning ms-2 cursor-pointer' />
            : <PauseFill onClick={togglePause} size={20} className='text-warning ms-2 cursor-pointer' />
          }
        </Col>
      </Row>
      <Row className='justify-content-center bg-dark py-1 mb-1'>
        <Col xs={1}></Col>
        <Col xs={10} className='text-center'>
          <NavLink to='/dashboard' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Dashboard</NavLink>
          <NavLink to='/market' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Market</NavLink>
          <NavLink to='/hangar' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Hangar</NavLink>
          <NavLink to='/missions' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Missions</NavLink>
          <NavLink to='/map' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Map</NavLink>
          <NavLink to='/statistics' className={({ isActive }) => `text-decoration-none text-white me-4 ${isActive ? 'fw-bold' : ''}`}>Statistics</NavLink>
          <NavLink to='/manual' className={({ isActive }) => `text-decoration-none text-white ${isActive ? 'fw-bold' : ''}`}>Manual</NavLink>
        </Col>
        <Col xs={1}>
          <FileEarmarkArrowDownFill size={16} className='text-white' role='button' title='Download Save File' onClick={GameController.downloadSaveJSON} />
          <TrashFill size={16} className='text-white ms-2' role='button' title='Delete Game' onClick={GameController.deleteGame} />
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Tab />
      </Row>
    </Container>
  )
}

export default App
