import React, { type ReactElement } from 'react'
import { Row, Col, Badge, Button, OverlayTrigger, Tooltip, Card } from 'react-bootstrap'
import { type HangarAsset } from '../../../controllers/HangarController'
import { GameController } from '../../../controllers/GameController'
import { Clock, DaysOfWeek, Timeframes } from '../../../controllers/helpers/Clock'
import { CashStack, ClockFill, PersonFill, Reception0, Reception1, Reception2, Reception3, Reception4, TagFill } from 'react-bootstrap-icons'
import { formatCashValue, formatUtilization } from '../../../controllers/helpers/Helpers'
import PlaneDetailsTooltip from '../../tooltips/PlaneDetailsTooltip'
import TimetableHoursCol from '../../fragments/TimetableHours'
import TimetableGrid from '../../fragments/TimetableGrid'
import ScheduleCalendarItem from '../../fragments/ScheduleCalendarItem'

interface Props {
  item: HangarAsset
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
        <Row className='justify-content-between pb-2'>
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
            <CashStack size={20} className='text-grey-dark me-2' />
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
          </Row>
          <Row className='mx-2 mb-2' style={{ height: '300px' }}>
            <TimetableHoursCol showLabels />
            {Object.values(DaysOfWeek).map((day) =>
              <Col key={day} style={{ position: 'relative' }} className={`rounded-bottom bg-${Controllers.Clock.currentDayOfWeek === day ? 'grey-light' : 'body'}`}>
                <TimetableGrid />
                <div className='position-absolute bg-warning opacity-25' style={{ top: `${Controllers.Clock.playtime % Timeframes.DAY / 6 + 15}px`, width: '100%', height: '10px', margin: '0 -12px' }}></div>
                {Controllers.Schedule
                  .getActiveSchedulesForAsset(asset)
                  .filter((schedule) => schedule.day === day || (schedule.day === Clock.getDayBefore(day) && schedule.end < schedule.start && schedule.end > '01:00'))
                  .sort((a, b) => (a.start < b.start ? -1 : 1))
                  .map((schedule) =>
                    <ScheduleCalendarItem
                      key={schedule.contract.id}
                      schedule={schedule}
                      tooltipPosition='top'
                      currentDayOfWeek={day} />
                  )
                }
              </Col>
            )}
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default HangarListItem
