import React, { useState } from 'react'
import { Badge, Col, Container, Row, Button } from 'react-bootstrap'
import { AirplaneEnginesFill, type Icon, Icon1CircleFill, Icon2CircleFill, Icon3CircleFill, RCircleFill, TrophyFill } from 'react-bootstrap-icons'
import { GameController } from '../controllers/GameController'
import { useNavigate } from 'react-router-dom'
import { Regions } from '../models/Airport'
import AirlineNameForm from './fragments/AirlineNameForm'

const ColPath: React.FC<{ Icon: Icon }> = ({ Icon }) => {
  return (
    <Col xs={'auto'} className='position-relative p-0'>
      <div className='icon-container'>
        <Icon size={40} className='text-white bg-primary' />
      </div>
      <div className='icon-container position-absolute z-1' style={{ top: '50%' }}>
        <AirplaneEnginesFill size={40} className='text-white opacity-25 rotate-180' style={{ left: '12px' }} />
      </div>
      <div className='z-0 opacity-25' style={{ marginLeft: '30px', height: '100%', width: '2px', borderLeft: '4px dotted' }}></div>
    </Col>
  )
}

const CreateAirline: React.FC = () => {
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const navigate = useNavigate()

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    GameController.startGame(name.trim(), region)
    navigate('/market')
  }

  return (
    <Container fluid className='p-0' id='create-airline'>
      <Row className='mh-100 vh-100 m-0'>
        <Col className='d-flex flex-column align-items-center justify-content-center p-4 mh-100 vh-100 position-relative overflow-hidden bg-page'>
          <AirplaneEnginesFill size={360} className='position-absolute opacity-50 text-secondary z-0' style={{ bottom: '-40px', left: '-120px' }} />
          <h1 className='text-primary fw-bold z-1'>Launch New Airline</h1>
          <div className='widget-shadow d-flex flex-column align-items-center p-4 z-1'>
            <div className='py-2'>
              {Object.keys(Regions).map((key) => (
                <img
                  key={key}
                  src={`/images/region-${key.toLocaleLowerCase()}.png`}
                  alt={Regions[key as keyof typeof Regions]}
                  className={`rounded m-1 cursor-pointer ${region === key ? 'border border-2 border-primary' : ''}`}
                  style={{ maxWidth: '80px' }}
                  onClick={() => { setRegion(key) }} />
              ))}
              {region !== '' && <p className='text-center'>Starting region: <strong>{Regions[region as keyof typeof Regions]}</strong></p>}
              {region === '' && <p className='text-center'>Select starting region</p>}
            </div>
            <div className='pb-2'>
              <AirlineNameForm name={name} setName={setName} onSubmitHandler={onSubmitHandler} />
            </div>
          </div>
          <div className='w-100 d-flex align-items-center justify-content-center py-5 z-1'>
            <div className='border-secondary' style={{ width: '25%', height: '2px', borderTop: '1px solid' }}></div>
            <span className='fw-bold text-secondary mx-2'>OR</span>
            <div className='border-secondary' style={{ width: '25%', height: '2px', borderTop: '1px solid' }}></div>
          </div>
          <Button className='text-white pt-2 px-4 z-1' onClick={() => { void GameController.loadDemo() }}><h4 className='fw-bold pt-1'>Load Demo Airline</h4></Button>
        </Col>
        <Col className='bg-primary text-white p-4 pt-0 position-relative overflow-x-hidden mh-100'>
          <AirplaneEnginesFill size={360} className='position-absolute opacity-25 rotate-300 z-0' style={{ top: '-40px', right: '-120px' }} />
          <Row>
            <Col xs={'auto'} className='position-relative p-0'>
              <div className='z-0 opacity-25' style={{ marginLeft: '30px', height: '100%', width: '2px', borderLeft: '4px dotted' }}></div>
            </Col>
            <Col className='d-flex justify-content-center'>
              <Badge bg='white' className='m-4 fs-2 text-primary d-flex align-items-center'>
                <TrophyFill size={24} className='text-badge-gold me-4' />
                How To Win
                <TrophyFill size={24} className='text-badge-gold ms-4' />
              </Badge>
            </Col>
          </Row>
          <Row>
            <ColPath Icon={Icon1CircleFill} />
            <Col className='me-5 z-2'>
              <h2 className='fw-bold'>Get Planes</h2>
              <p className='fs-6'>Buy or lease planes from the Market. You&apos;ll get new offers each week. Older planes are cheaper, however, they have higher maintenance cost and bring less reputation to the Airline.</p>
              <img src='/images/create-market.png' alt='Market' className='rounded w-100 widget-shadow' style={{ maxWidth: '740px' }} />
            </Col>
          </Row>
          <Row className='mt-4'>
            <ColPath Icon={Icon2CircleFill} />
            <Col className='me-5 z-2'>
              <h2 className='fw-bold'>Sign Contracts</h2>
              <p className='fs-6'>You&apos;ll sign connections in the Contracts view that refreshes daily. Some flights are simply not profitable, though! The longer the route, the more reputation you gain. Each plane can fly from one hub only.</p>
              <img src='/images/create-contracts.png' alt='Contracts' className='rounded w-100 widget-shadow' style={{ maxWidth: '740px' }} />
            </Col>
          </Row>
          <Row className='mt-4'>
            <ColPath Icon={Icon3CircleFill} />
            <Col className='me-5 z-2'>
              <h2 className='fw-bold'>Complete Missions</h2>
              <p className='fs-6'>Visit Missions tab to check your next targets and praise your achievements. Can you get them all?</p>
              <img src='/images/create-missions.png' alt='Missions' className='rounded border w-100' style={{ maxWidth: '740px' }} />
            </Col>
          </Row>
          <Row className='mt-4'>
            <ColPath Icon={RCircleFill} />
            <Col className='me-5 z-2'>
              <h2 className='fw-bold'>Repeat and Grow Your Airline!</h2>
              <p className='fs-6'>Be aware - contracts expire and leases end, too! Make sure your planes have good utilization. Can you reach the Platinum Airline status?</p>
              <img src='/images/create-map.png' alt='Destinations Map' className='rounded border w-100' />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default CreateAirline
