import React, { type ReactElement } from 'react'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import { Book } from 'react-bootstrap-icons'
import { MarketController } from '../../controllers/MarketController'
import { Tier, type TierRecord, Tiers } from '../../controllers/helpers/Tiers'
import { GameController } from '../../controllers/GameController'
import { formatCashValue, formatPercentageValue } from '../../controllers/helpers/Helpers'

interface Props {
  fullWidth?: boolean
  fullHeight?: boolean
}

const ManualWidget: React.FC<Props> = ({ fullWidth = false, fullHeight = false }): ReactElement => {
  const planes = MarketController.getInstance().getAllPlanes()
  const tiers = [Tier.BRONZE, Tier.SILVER, Tier.GOLD, Tier.PLATINUM]

  const tierItems: Array<{ name: string, property: (tier: TierRecord) => number | string }> = [
    { name: 'Maximum Take-Off Weight', property: (tier: TierRecord) => `${tier.constraints.MTOW} tons` },
    { name: 'Max planes in hangar', property: (tier: TierRecord) => tier.constraints.maxPlanes },
    { name: 'Reputation gain speed', property: (tier: TierRecord) => formatPercentageValue(tier.constraints.reputationGain) },
    { name: 'Max number of regions', property: (tier: TierRecord) => tier.constraints.maxNumberOfRegions },
    { name: 'Can fly cross-region?', property: (tier: TierRecord) => (tier.constraints.canFlyCrossRegion ? 'Yes' : 'No') },
    { name: 'Can order new planes?', property: (tier: TierRecord) => (tier.constraints.canOrderNewPlanes ? 'Yes' : 'No') },
    { name: 'Hub discount', property: (tier: TierRecord) => formatPercentageValue(tier.perks.hubDiscount) },
    { name: 'Destination discount', property: (tier: TierRecord) => formatPercentageValue(tier.perks.destinationDiscount) },
    { name: 'Market discount', property: (tier: TierRecord) => formatPercentageValue(tier.perks.marketDiscount) }
  ]

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 widget-shadow' >
        <Card.Header className='position-sticky d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <Book size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>Manual</span>
          </div>
        </Card.Header>
        <Card.Body className={`d-flex flex-column overflow-auto pt-0 pb-2 ${fullHeight ? 'widget-full-height' : 'mh-350'}`} >
          <Row>
            <Col xs={12} className='px-4'>
              <div className='text-info small fw-bold mb-2 mt-2'>AVAILABLE PLANES</div>
              <Row className='bg-info text-white rounded py-1'>
                <Col className='table-header-cell'>Min Tier</Col>
                <Col style={{ minWidth: '150px' }}className='table-header-cell'>Plane</Col>
                <Col style={{ minWidth: '120px' }} className='table-header-cell'>MTOW</Col>
                <Col style={{ minWidth: '120px' }} className='table-header-cell'>Max Range</Col>
                <Col style={{ minWidth: '120px' }} className='table-header-cell'>Cruise Speed</Col>
                <Col style={{ minWidth: '320px' }} className='table-header-cell'>Max Seating</Col>
                <Col style={{ minWidth: '150px' }} className='table-header-cell'>Price (New)</Col>
                <Col className='table-header-cell'>Max Reputation</Col>
              </Row>
              {tiers.map((tier, indexTiers) => (
                <React.Fragment key={tier}>
                  {planes
                    .filter((plane) => plane.typeName !== 'Concorde' && plane.MTOW <= Tiers[tier].constraints.MTOW && (indexTiers === 0 ? plane.MTOW > 0 : plane.MTOW > Tiers[tiers[indexTiers - 1]].constraints.MTOW))
                    .sort((a, b) => a.MTOW - b.MTOW)
                    .concat((tier === Tier.PLATINUM ? planes.filter((plane) => plane.typeName === 'Concorde')[0] : []))
                    .map((plane, indexPlanes) => (
                      <Row key={plane.typeName} className={`py-1 hover-bg-light ${indexTiers !== 0 && indexPlanes === 0 ? 'border-top border-info-light' : ''}`}>
                        <Col className='text-center'><Badge bg={`badge-${tier.toLocaleLowerCase()}`} className='text-white me-2'>{tier}</Badge></Col>
                        <Col style={{ minWidth: '150px' }}>{plane.familyName} {plane.typeName}</Col>
                        <Col style={{ minWidth: '120px' }} className='text-end'>{GameController.formatWeight(plane.MTOW)}</Col>
                        <Col style={{ minWidth: '120px' }} className='text-end'>{GameController.formatDistance(plane.maxRange)}</Col>
                        <Col style={{ minWidth: '120px' }} className='text-end'>{GameController.formatSpeed(plane.cruiseSpeed)}</Col>
                        <Col style={{ minWidth: '320px' }} className='text-center'>
                          <strong>{plane.maxSeating.economy + plane.maxSeating.business + plane.maxSeating.first}</strong>
                          <span className='text-grey-dark small ms-2'>{`Economy: ${plane.maxSeating.economy} ● Business: ${plane.maxSeating.business} ● First: ${plane.maxSeating.first}`}</span>
                        </Col>
                        <Col style={{ minWidth: '150px' }} className='text-end'>{formatCashValue(plane.pricing.purchase)}</Col>
                        <Col className='text-center'>{`+${plane.reputation}.00%`}</Col>
                      </Row>
                    ))}
                </React.Fragment>
              ))}
            </Col>
          </Row>
          <Row>
            <Col xs={6} className='ps-4'>
              <div className='text-info small fw-bold mb-2 mt-4'>AIRLINE TIERS</div>
              <Row className='bg-info text-white rounded pt-2 pb-2'>
                <Col xs={4}></Col>
                {tiers.map((tier) => (
                  <Col key={tier} className='text-center'>
                    <Badge bg={`badge-${tier.toLocaleLowerCase()}`} className='text-white me-2'>{tier}</Badge>
                  </Col>
                ))}
              </Row>
              {tierItems.map((tierItem) => (
                <Row key={tierItem.name} className='hover-bg-light pt-1'>
                  <Col xs={4}>{tierItem.name}</Col>
                  {tiers.map((tier) => (
                    <Col key={tier} className='text-center'>
                      {tierItem.property(Tiers[tier])}
                    </Col>
                  ))}
                </Row>
              ))}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ManualWidget
