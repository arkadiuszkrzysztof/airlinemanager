import React, { type ReactElement } from 'react'
import { Card, Col, Row } from 'react-bootstrap'

import { GameController } from '../../controllers/GameController'
import { Regions } from '../../models/Airport'
import { Map, StarFill } from 'react-bootstrap-icons'
import { formatCashValue } from '../../controllers/helpers/Helpers'

interface Props {
  fullWidth?: boolean
}

const UnlockPrice = { NA: 10000000, EU: 10000000, ASIA: 10000000, LATAM: 10000000, AFRICA: 10000000, OCEANIA: 10000000 }
const RegionReputationGain = 5

const unlockRegion = (region: string): void => {
  if (canUnlock(region)) {
    const Controllers = GameController.getInstance()
    Controllers.Airline.unlockRegion(region, UnlockPrice[region as keyof typeof UnlockPrice], RegionReputationGain)
  }
}

const isUnlocked = (region: string): boolean => {
  const Controllers = GameController.getInstance()

  return Controllers.Airline.unlockedRegions.includes(region)
}

const canUnlock = (region: string): boolean => {
  const Controllers = GameController.getInstance()

  return !isUnlocked(region) &&
    Controllers.Airline.cash >= UnlockPrice[region as keyof typeof UnlockPrice] &&
    Controllers.Airline.getTier().record.constraints.maxNumberOfRegions > Controllers.Airline.unlockedRegions.length
}

const RegionsWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 border-secondary' >
        <Card.Header className='position-sticky bg-secondary border-0 d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <Map size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>World Regions</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column mh-400 overflow-auto pt-0 pb-2'>
          <Row className='mx-2 mb-2 position-relative'>
            {Object.keys(Regions).map((key) => (
              <Col key={key} xs={2} className='text-center'>
                <div className={`border pt-1 mt-3 bg-grey-light rounded ${isUnlocked(key) ? '' : canUnlock(key) ? 'cursor-pointer' : 'grayscale opacity-50'}`} onClick={() => { unlockRegion(key) }}>
                  <img
                    src={`/images/region-${key.toLocaleLowerCase()}.png`}
                    alt={Regions[key as keyof typeof Regions]}
                    className={'rounded m-1'}
                    style={{ maxWidth: '100px' }}
                    onClick={() => { unlockRegion(key) }} />
                  <p className='text-center mb-0 fw-bold text-secondary'>{Regions[key as keyof typeof Regions]}</p>
                  {!isUnlocked(key) && <p className='text-center mb-0'>Unlock for <strong>{formatCashValue(UnlockPrice[key as keyof typeof UnlockPrice])}</strong></p>}
                  {!isUnlocked(key) && <p className='text-center mb-2 d-flex align-items-center justify-content-center'>
                    <StarFill size={16} className='text-badge-gold ms-4 me-2' />
                    <span className='fw-bold'>{` +${RegionReputationGain.toFixed(2)}%`}</span></p>}
                  {isUnlocked(key) && <p className='text-center mb-2 text-primary fw-bold'>Unlocked</p>}
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default RegionsWidget
