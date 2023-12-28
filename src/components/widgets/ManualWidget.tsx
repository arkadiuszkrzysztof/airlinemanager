import React, { type ReactElement } from 'react'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import { Book, Icon1CircleFill, Icon2CircleFill, Icon3CircleFill, RCircleFill } from 'react-bootstrap-icons'
import { MarketController } from '../../controllers/MarketController'
import { Tier, type TierRecord, Tiers } from '../../controllers/helpers/Tiers'
import { GameController } from '../../controllers/GameController'
import { formatCashValue, formatPercentageValue, formatScale } from '../../controllers/helpers/Helpers'
import { Link } from 'react-router-dom'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AchievementData, MissionData } from '../../controllers/MissionController'

interface Props {
  fullWidth?: boolean
  fullHeight?: boolean
}

const Dot: React.FC = (): ReactElement => (
  <span className='text-info me-2'>●</span>
)

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

  const depreciationData: Array<{ year: number, depreciation: number, value: number }> = (() => {
    const data: Array<{ year: number, depreciation: number, value: number }> = [{ year: 0, depreciation: 0, value: 250000000 }]

    for (let i = 1; i <= 40; i++) {
      const depreciation = Math.max((Math.abs(25 - i) / 300), 0.02)
      data.push({ year: i, depreciation, value: data[i - 1].value * (1 - depreciation) })
    }

    return data
  })()

  const calculateDemand = (airportA: number, airportB: number): Array<{ totalPassengers: number, demand: number | null }> => {
    const data: Array<{ totalPassengers: number, demand: number | null }> = []

    for (let totalPassengers = 0; totalPassengers <= 120000000; totalPassengers += 10000000) {
      const normalizedA = totalPassengers / 100000000 * airportA
      const normalizedB = totalPassengers / 100000000 * airportB
      const demandRatio = 0.25 * Math.pow((Math.min(normalizedA, normalizedB) - 50000000) / 25000000, 2) + 0.05 * Math.pow((Math.max(normalizedA, normalizedB) - 100000000) / 50000000, 2) + 1
      const demand = {
        economy: Math.floor(demandRatio * (Math.min(normalizedA, normalizedB) / 15000000) * 300),
        business: Math.floor(demandRatio * (Math.min(normalizedA, normalizedB) / 15000000) * 25),
        first: Math.floor(demandRatio * (Math.min(normalizedA, normalizedB) / 15000000) * 5)
      }

      data.push({ totalPassengers, demand: (airportA + airportB >= totalPassengers) ? demand.economy + demand.business + demand.first : null })
    }

    return data
  }

  const demandData: Array<{ totalPassengers: number, demandSL: number | null, demandML: number | null, demandLL: number | null }> = (() => {
    const demandSL = calculateDemand(10000000, 50000000)
    const demandML = calculateDemand(30000000, 50000000)
    const demandLL = calculateDemand(50000000, 80000000)

    const data: Array<{ totalPassengers: number, demandSL: number | null, demandML: number | null, demandLL: number | null }> = []

    for (let i = 0; i < demandSL.length; i++) {
      data.push({ totalPassengers: demandSL[i].totalPassengers, demandSL: demandSL[i].demand, demandML: demandML[i].demand, demandLL: demandLL[i].demand })
    }

    return data
  })()

  const formatTooltipLabels = (value: any, name: any): [string, string] => {
    const Labels = { value: 'Plane value', depreciation: 'Depreciation rate', demandSL: 'Small & Large Airports', demandML: 'Medium & Large Airports', demandLL: 'Large & Large Airports' }

    return [name === 'value' ? formatCashValue(value) : name === 'depreciation' ? formatPercentageValue(value, true) : value, Labels[name as keyof typeof Labels]]
  }

  const MissionsCount = {
    generic: MissionData.filter((mission) => mission.region === undefined).length,
    regions: MissionData.filter((mission) => mission.region !== undefined).length,
    all: MissionData.length
  }

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
            <Col xs={6} className='px-4'>
              <div className='text-info fs-4 fw-bold mb-2 mt-2'>HOW TO WIN?</div>
              <div>
                <Icon1CircleFill size={16} className='text-info mb-1 me-2' /><strong>Get Planes</strong><br />
                <Dot />Buy or lease planes from the <Link to='/market' className='text-decoration-none text-info fw-bold'>Market</Link>. You&apos;ll get new offers each week. Older planes are cheaper, however, they have higher maintenance costs and bring less reputation to the Airline. It&apos;s recommended to start with leased planes, and then buy newer ones once the <Badge bg={'badge-platinum'} className='text-white mx-1'>Platinum</Badge> tier discounts kick in.<br />
                <Dot /><Badge bg={'secondary'} className='text-white me-1'>NERD ALERT!</Badge>Plane values are calculated using a variant of sum-of-years-digits depreciation method: <span className='code-snippet'>thisYearValue = lastYearValue * (1 - depreciation)</span>, where <span className='code-snippet'>depreciation = max[|25 - age| / 300, 0.02]</span>.<br />
                <div style={{ height: '200px', minWidth: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart width={700} height={200} data={depreciationData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" interval={9} tickFormatter={(value) => (value === 0 ? 'New' : `${value} years`)} />
                      <YAxis yAxisId="left" tickFormatter={(value: any) => formatScale(value, true)} label={{ value: 'Value', style: { textAnchor: 'middle' }, angle: -90, position: 'left', offset: 0 }} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value: any) => formatPercentageValue(value)} label={{ value: 'Depreciation', style: { textAnchor: 'middle' }, angle: -90, position: 'right', offset: -10 }} />
                      <Tooltip formatter={(value: any, name: any) => formatTooltipLabels(value, name)} />
                      <Line isAnimationActive={false} yAxisId="left" type="monotone" dataKey="value" stroke="#a583f5" dot={false} activeDot={{ r: 4 }} />
                      <Line isAnimationActive={false} yAxisId="right" type="monotone" dataKey="depreciation" stroke="#81D8D0" dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className='mt-2'>
                <Icon2CircleFill size={16} className='text-info mb-1 me-2' /><strong>Sign Contracts</strong><br />
                <Dot />You&apos;ll sign connections in the Contracts view that refreshes daily on the <Link to='/market' className='text-decoration-none text-info fw-bold'>Market</Link> tab. Some flights are simply not profitable, though! The longer the route, the more reputation you gain. Each plane can fly from one hub only - once you sign the first contract for a given plane, you would be only able to sign another contract for that plane originating from the same location.<br />
                <Dot />The higher your reputation, the better discounts you get for plane take-off and passenger terminal fees. However, tier change doesn&apos;t affect already accepted contracts - it counts for new ones only.<br />
                <Dot />You can track all your contracts in the <Link to='/hangar' className='text-decoration-none text-info fw-bold'>Hangar</Link> tab, which lists all your planes and their details. You can also sell or cancel the lease for your planes there.<br />
                <Dot /><Badge bg={'secondary'} className='text-white me-1'>NERD ALERT!</Badge>The demand for a route depends on the sum of passengers from both the airports and is calculated using the following quadratic function: <span className='code-snippet'>demandRatio = 0.25 * ((min[airportA, airportB] - 50,000,000) / 25,000,000)^2 + 0.05 * ((max[airportA, airportB] - 100,000,000) / 50,000,000)^2</span>. Then, the numbers of economy, business and first-class passengers are calculated using the formula: <span className='code-snippet'>seats = demandRatio * (min[airportA, airportB] / 15,000,000) * [300, 25, 5]</span>, respectively.
                <div className='mt-2' style={{ height: '250px', minWidth: '100%' }}>
                  <ResponsiveContainer width={'100%'} height={'100%'}>
                    <LineChart width={700} height={200} data={demandData} margin={{ top: 0, right: 50, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey="totalPassengers" interval={2} tickFormatter={(value: number) => value.toLocaleString('en-US')} label={{ value: 'Sum of Airports Total Passengers', style: { textAnchor: 'middle' }, position: 'bottom', offset: 0 }} />
                      <YAxis label={{ value: 'Demand', style: { textAnchor: 'middle' }, angle: -90, position: 'left', offset: 0 }} />
                      <Tooltip formatter={(value: any, name: any) => formatTooltipLabels(value, name)} />
                      <Line isAnimationActive={false} type="monotone" dataKey="demandLL" stroke="#90cfa3" dot={false} activeDot={{ r: 4 }} />
                      <Line isAnimationActive={false} type="monotone" dataKey="demandML" stroke="#fad263" dot={false} activeDot={{ r: 4 }} />
                      <Line isAnimationActive={false} type="monotone" dataKey="demandSL" stroke="#fca88a" dot={false} activeDot={{ r: 4 }} />
                      <Legend formatter={(name: any) => formatTooltipLabels(undefined, name)} verticalAlign='top' />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Col>
            <Col xs={6} className='px-4'>
              <div className='mt-2'>
                <Icon3CircleFill size={16} className='text-info mb-1 me-2' /><strong>Complete Missions</strong><br />
                <Dot />Visit <Link to='/missions' className='text-decoration-none text-info fw-bold'>Missions</Link> tab to check your next targets and praise your achievements. At the top, you can unlock new world regions. To do so, you need $10 million for the second region, then $20 million for the third, and so on - the starting one is on us! Please note the maximum number of regions is limited by your tier.<br />
                <Dot />Below, you&apos;ll find active missions and all the completed ones. There are two types of missions: generic {`(${MissionsCount.generic} of ${MissionsCount.all})`} and region-specific {`(${MissionsCount.regions} of ${MissionsCount.all})`}. The generic ones relate to the planes you own or ticket classes you offer. The region-specific ones, however, require signing contracts to specific airports. Also, they unveil as you unlock new regions. The active mission might change once you unlock a new region, too! But don&apos;t worry - your progress is saved even if the active mission changes. You can complete each mission and receive the reward only once.<br />
                <Dot />The Achievements are self-explanatory, I hope! Collect all for increasing airline reputation, getting new planes, delivering passengers, and earning money. There are {AchievementData.length} achievements in total.
              </div>
              <div className='mt-2'>
                <RCircleFill size={16} className='text-info mb-1 me-2' /><strong>Repeat and Grow Your Airline!</strong><br />
                <Dot />Be aware - contracts expire and leases end, too! Make sure your airline is in good shape - do that by checking Healthcheck metrics on the <Link to='/dashboard' className='text-decoration-none text-info fw-bold'>Dashboard</Link>. Also, check out the <Link to='/statistics' className='text-decoration-none text-info fw-bold'>Statictics</Link> tab with all the fancy charts to appreciate the progress you make. And finally, enjoy the live preview of all your connections and in-air flights on the <Link to='/map' className='text-decoration-none text-info fw-bold'>Map</Link> view.<br />
                <Dot /><Badge bg={'secondary'} className='text-white me-1'>BONUS</Badge>Once you reach the <Badge bg={'badge-platinum'} className='text-white mx-1'>Platinum</Badge> tier, you&apos;ll have 5% chance each week to find Concorde on the market. It&apos;s the fastest plane in the game, but it&apos;s also the most expensive one. On the bright side, the business and first-class tickets are 3x more expensive than on the other jets, so you still can make a decent profit flying between super-large airports!
              </div>

              <div className='text-info fs-4 fw-bold mb-2 mt-4'>AIRLINE TIERS</div>
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
          <Row>
            <Col xs={12} className='px-4 mb-4'>
              <div className='text-info fs-4 fw-bold mb-2 mt-4'>AVAILABLE PLANES</div>
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
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ManualWidget
