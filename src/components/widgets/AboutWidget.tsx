import React, { type ReactElement } from 'react'
import { Card, Col } from 'react-bootstrap'

import { AirplaneEnginesFill, Instagram, PersonBoundingBox, Tiktok, Youtube } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'

interface Props {
  fullWidth?: boolean
}

const AboutWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 widget-shadow' >
        <Card.Header className='position-sticky d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <PersonBoundingBox size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>About</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2 align-items-center'>
          <h2 className='text-primary mt-2 mb-4'>
            <AirplaneEnginesFill size={40} className='text-primary me-2 mb-2 rotate-30'/>
            <strong>Airline Manager</strong>
            <small className='text-info ms-2'>v1.0.0</small>
          </h2>
          <p className='text-center'>Hi, I&apos;m Arek. I&apos;ll share a secret with you... I LOVE PLANES! xD<br />I hope you enjoy plaing the game.<br />Please share your feedback and suggestions via DMs on my socials:</p>
          <div className='text-center'>
            <Link to={'https://instagram.com/razuponatime'} target='_blank'><Instagram size={40} className='text-secondary me-4' /></Link>
            <Link to={'https://www.tiktok.com/@razuponatime'} target='_blank'><Tiktok size={40} className='text-secondary me-4' /></Link>
            <Link to={'https://www.youtube.com/@razuponatime'} target='_blank'><Youtube size={40} className='text-secondary' /></Link>
            <p className='fw-bold text-secondary mt-3'>@razuponatime</p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default AboutWidget
