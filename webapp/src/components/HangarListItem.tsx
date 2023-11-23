import React, { type ReactElement, useContext } from 'react'
import { Row, Col, Badge, Button, OverlayTrigger, Tooltip, Accordion, AccordionContext, useAccordionButton, Card } from 'react-bootstrap'
import { type HangarAsset } from '../controllers/HangarController'
import { GameController } from '../controllers/GameController'
import { Clock, DaysOfWeek, Timeframes } from '../controllers/helpers/Clock'
import { AirplaneFill, ArrowLeftRight, CaretDownFill, Cash, ClockFill, PersonFill, Reception0, Reception1, Reception2, Reception3, Reception4, TagFill } from 'react-bootstrap-icons'
import { flightStatus, formatCashValue, formatUtilization } from '../controllers/helpers/Helpers'
import ScheduleDetailsTooltip from './tooltips/ScheduleDetailsTooltip'
import PlaneDetailsTooltip from './tooltips/PlaneDetailsTooltip'
import TimetableHoursCol from './fragments/TimetableHours'
import TimetableGrid from './fragments/TimetableGrid'

interface Props {
  item: HangarAsset
}

const ContextAwareToggle: React.FC<{ children?: ReactElement, eventKey: string, callback?: (eventKey: string) => void }> = ({ children, eventKey, callback }) => {
  const { activeEventKey } = useContext(AccordionContext)

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => { if (callback !== undefined) callback(eventKey) }
  )

  const isCurrentEventKey = activeEventKey === eventKey

  return (
    <CaretDownFill onClick={decoratedOnClick} role="button" size={40} className={`text-secondary rotate-${isCurrentEventKey ? '180' : '0'}`} />
  )
}

const HangarListItem: React.FC<Props> = ({ item: asset }) => {
  const Controllers = GameController.getInstance()

  const weeklyProfit = (): number => {
    const totalProfit = Controllers.Schedule
      .getActiveSchedulesForAsset(asset)
      .reduce((profit, schedule) => profit + schedule.option.profit, 0)

    return totalProfit
  }

  const getTimeUseIndicator = (asset: HangarAsset, day: DaysOfWeek): ReactElement => {
    const totalTime = Controllers.Schedule.getTotalUseTime(asset, day)

    if (totalTime >= '12:00') {
      return <Reception4 size={12} className='me-2 text-secondary' />
    } else if (totalTime >= '8:00') {
      return <Reception3 size={12} className='me-2 text-info' />
    } else if (totalTime >= '04:00') {
      return <Reception2 size={12} className='me-2 text-info' />
    } else if (totalTime > '00:00') {
      return <Reception1 size={12} className='me-2 text-danger' />
    } else {
      return <Reception0 size={12} className='me-2 text-danger' />
    }
  }

  const getUtilizationIndicator = (asset: HangarAsset, day: DaysOfWeek): ReactElement => {
    const averageUtilization = Controllers.Schedule.getAverageUtilization(asset, day)

    if (averageUtilization >= 85) {
      return <Reception4 size={12} className='text-secondary' />
    } else if (averageUtilization >= 70) {
      return <Reception3 size={12} className='text-info' />
    } else if (averageUtilization >= 50) {
      return <Reception2 size={12} className='text-info' />
    } else if (averageUtilization > 20) {
      return <Reception1 size={12} className='text-danger' />
    } else {
      return <Reception0 size={12} className='text-danger' />
    }
  }

  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <Col xs={12}>
        <Row className='justify-content-between'>
          <Col xs={'auto'} className='d-flex align-items-center'>
            {asset.plane.hub !== undefined &&
              <Badge bg='dark' className='me-2 fs-5'>{asset.plane.hub.IATACode}</Badge>
            }
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><PlaneDetailsTooltip asset={asset} /></Tooltip>}
            >
              <span className='fs-5 fw-bold text-primary cursor-help'>{`${asset.plane.familyName} ${asset.plane.typeName}`}</span>
            </OverlayTrigger>
            <TagFill size={20} className='text-grey-dark ms-4 me-2' />
            <span className='text-grey-dark'>{asset.plane.registration}</span>
            <Badge bg={asset.ownership === 'owned' ? 'dark' : 'light'} className='mx-4'>
              {asset.ownership.toUpperCase()}
            </Badge>
            <Cash size={20} className='text-grey-dark me-2' />
            <span className={`fw-bold mx-1 ${weeklyProfit() > 0 ? 'text-dark' : 'text-danger'}`}>
              {formatCashValue(weeklyProfit())}
            </span>
            per week
          </Col>
          <Col xs={'auto'} className='d-flex align-items-center justify-content-end'>
            {asset.ownership === 'leased' && asset.plane.leaseExpirationTime !== undefined &&
              <span className='fw-bold text-grey-dark me-2'>Lease ends in {Clock.getFormattedTimeUntil(asset.plane.leaseExpirationTime)}</span>
            }
            {asset.ownership === 'owned'
              ? <Button variant='outline-primary' size='sm' className='me-2' onClick={() => { Controllers.Airline.sellPlane(asset) }}>
                Sell for {formatCashValue(asset.plane.sellPrice)}
              </Button>
              : <Button variant='outline-danger' size='sm' className='me-2' onClick={() => { Controllers.Airline.cancelLease(asset) }}>
                Cancel early with {formatCashValue(asset.plane.pricing.leaseCancellationFee)} penalty
              </Button>
            }
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        <Accordion className='mt-2'>
          <Card>
            <Row className='mx-2 mt-2'>
              <Col xs={'auto'}>
                <div className='timetable-hour mw-50'></div>
              </Col>
              {Object.values(DaysOfWeek).map((day) =>
                <Col key={day} className={`d-flex flex-column justify-content-center rounded-top bg-${Controllers.Clock.currentDayOfWeek === day ? 'grey-light' : 'body'}`}>
                  <div className='text-center fw-bold text-dark'>
                    {day}
                  </div>
                  <div className='text-center text-grey-dark'>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: 'fixed' }}><strong>Total time in use:</strong><br />{Controllers.Schedule.getTotalUseTime(asset, day)}</Tooltip>}>
                      <span className='cursor-help'>
                        <ClockFill size={12} className='me-2' />
                        {getTimeUseIndicator(asset, day)}
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: 'fixed' }}><strong>Average seat utilization:</strong><br />{formatUtilization(Controllers.Schedule.getAverageUtilization(asset, day))}</Tooltip>}>
                      <span className='cursor-help'>
                        <PersonFill size={12} className='me-2' />
                        {getUtilizationIndicator(asset, day)}
                      </span>
                    </OverlayTrigger>
                  </div>
                </Col>
              )}
              <Col xs={'auto'} className='flex-grow-0'>
                <div className='timetable-hour mw-50'>
                  <ContextAwareToggle eventKey="0" />
                </div>
              </Col>
            </Row>
            <Accordion.Collapse eventKey="0">
            <Row className='mx-2 mb-2' style={{ height: '300px' }}>
              <TimetableHoursCol showLabels />
              {Object.values(DaysOfWeek).map((day) =>
                <Col key={day} style={{ position: 'relative' }} className={`rounded-bottom bg-${Controllers.Clock.currentDayOfWeek === day ? 'grey-light' : 'body'}`}>
                  <TimetableGrid />
                  {Controllers.Schedule
                    .getActiveSchedulesForAsset(asset)
                    .filter((schedule) => schedule.day === day)
                    .sort((a, b) => (a.start < b.start ? -1 : 1))
                    .map((schedule) =>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><ScheduleDetailsTooltip schedule={schedule} /></Tooltip>}
                        key={schedule.contract.id}
                      >
                        <div
                          className='d-flex align-items-center justify-content-center bg-info bg-opacity-75 hover-bg-info rounded cursor-help'
                          style={{
                            position: 'absolute',
                            top: `${Clock.getTimeAt(schedule.start) % Timeframes.DAY / 6 + 20}px`,
                            width: 'calc(100% - 24px)',
                            height: `${(schedule.option.totalTime) / 6}px`
                          }}
                        >
                          {schedule.contract.hub.IATACode}
                          {flightStatus(schedule).inTheAir
                            ? flightStatus(schedule).flightLeg === 'there'
                              ? <AirplaneFill size={12} className='text-warning mx-2 rotate-90 pulse-animation'/>
                              : <AirplaneFill size={12} className='text-warning mx-2 rotate-270 pulse-animation'/>
                            : <ArrowLeftRight size={12} className='text-dark mx-2'/>}
                          {schedule.contract.destination.IATACode}
                        </div>
                      </OverlayTrigger>
                    )
                  }
                </Col>
              )}
              <TimetableHoursCol />
            </Row>
        </Accordion.Collapse>
      </Card>
      </Accordion>
      </Col>
    </Row>
  )
}

export default HangarListItem
