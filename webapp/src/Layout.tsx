import React from 'react'
import { Link, Outlet } from 'react-router-dom'

import { Container, Row, Col, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { AirplaneFill, CalendarWeek, Coin, StarFill } from 'react-bootstrap-icons'

import { type Controllers } from './controllers/GameController'
import TierDetailsTooltip from './components/tooltips/TierDetailsTooltip'
import ReputationBreakdownTooltip from './components/tooltips/ReputationBreakdownTooltip'

interface Props {
  Controllers: Controllers
}

const App: React.FC<Props> = ({ Controllers }) => {
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
        <Col xs={10} className='text-center'>
          <Link to='/dashboard' className='text-decoration-none'>Dashboard</Link>
          <Link to='/operations' className='text-decoration-none mx-4'>Operations</Link>
          <Link to='/mission' className='text-decoration-none mx-4'>Mission</Link>
          <Link to='/map' className='text-decoration-none'>Map</Link>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Outlet />
      </Row>
    </Container>
  )
}

export default App
