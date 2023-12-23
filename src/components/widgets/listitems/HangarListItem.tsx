import React, { useState, type ReactElement } from 'react'
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
import AirportDetailsTooltip from '../../tooltips/AirportDetailsTooltip'
import { type Schedule } from '../../../controllers/ScheduleController'

interface Props {
  item: HangarAsset
}

const HangarListItem: React.FC<Props> = ({ item: asset }) => {
  const Controllers = GameController.getInstance()
  const [highlightedSchedule, setHighlightedSchedule] = useState('')

  const handleItemSelect = (schedule: Schedule): void => {
    setHighlightedSchedule(schedule.contract.id)
  }

  const handleItemDeselect = (): void => {
    setHighlightedSchedule('')
  }

  const weeklyProfit = (): number => {
    const totalProfit = Controllers.Schedule
      .getActiveSchedulesForAsset(asset)
      .reduce((profit, schedule) => profit + schedule.option.profit, 0)

    return totalProfit
  }

  const getTimeUseIndicator = (asset: HangarAsset, day: string): ReactElement => {
    const totalTime = Controllers.Schedule.getUseTimeForAsset(asset, day)

    if (totalTime >= 12 * Timeframes.HOUR) {
      return <Reception4 size={12} className='me-2 text-success' />
    } else if (totalTime >= 8 * Timeframes.HOUR) {
      return <Reception3 size={12} className='me-2 text-warning' />
    } else if (totalTime >= 4 * Timeframes.HOUR) {
      return <Reception2 size={12} className='me-2 text-warning' />
    } else if (totalTime > 0) {
      return <Reception1 size={12} className='me-2 text-danger' />
    } else {
      return <Reception0 size={12} className='me-2 text-danger' />
    }
  }

  const getUtilizationIndicator = (asset: HangarAsset, day: string): ReactElement => {
    const averageUtilization = Controllers.Schedule.getAverageUtilizationForAsset(asset, day)

    if (averageUtilization >= 85) {
      return <Reception4 size={12} className='text-success' />
    } else if (averageUtilization >= 70) {
      return <Reception3 size={12} className='text-warning' />
    } else if (averageUtilization >= 50) {
      return <Reception2 size={12} className='text-warning' />
    } else if (averageUtilization > 20) {
      return <Reception1 size={12} className='text-danger' />
    } else {
      return <Reception0 size={12} className='text-danger' />
    }
  }

  return (
    <Row className='bg-light bg-opacity-75 item-shadow rounded my-2 mx-1 p-2'>
      <Col xs={12}>
        <Row className='justify-content-between pt-2 pb-3'>
          <Col xs={'auto'} className='d-flex align-items-center'>
            {asset.plane.hub !== undefined &&
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><AirportDetailsTooltip airport={asset.plane.hub} /></Tooltip>}
              >
                <Badge bg='secondary' className='me-2 fs-5 cursor-help'>{asset.plane.hub.IATACode}</Badge>
              </OverlayTrigger>
            }
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip className='tooltip-medium' style={{ position: 'fixed' }}><PlaneDetailsTooltip asset={asset} /></Tooltip>}
            >
              <span className='fs-5 fw-bold text-primary cursor-help'>{`${asset.plane.familyName} ${asset.plane.typeName}`}</span>
            </OverlayTrigger>
            <TagFill size={20} className='text-grey-dark ms-4 me-2' />
            <span>{asset.plane.registration}</span>
            <Badge bg={asset.ownership === 'owned' ? 'success-light' : 'info-light'} className='mx-4'>
              {asset.ownership.toUpperCase()}
            </Badge>
            <CashStack size={20} className='text-grey-dark me-2' />
            <span className={`fw-bold mx-1 ${weeklyProfit() > 0 ? 'text-success' : 'text-danger'}`}>
              {formatCashValue(weeklyProfit())}
            </span>
            per week
          </Col>
          <Col xs={'auto'} className='d-flex align-items-center justify-content-end'>
            {asset.ownership === 'leased' && asset.plane.leaseExpirationTime !== undefined &&
              <span className='me-2'>Lease ends in {Clock.getFormattedTimeUntil(asset.plane.leaseExpirationTime)}</span>
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
        <Card className='bg-white'>
          <Row className='mx-2 mt-2'>
            <Col xs={'auto'}>
              <div className='timetable-hour mw-50'></div>
            </Col>
            {DaysOfWeek.map((day) =>
              <Col key={day} className={`d-flex flex-column justify-content-center rounded-top bg-${Controllers.Clock.currentDayOfWeek === day ? 'danger bg-opacity-10' : 'body'}`}>
                <div className='text-center fw-bold text-dark'>
                  {day}
                </div>
                <div className='text-center text-grey-dark'>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: 'fixed' }}><strong>Total time in use:</strong><br />{Clock.formatPlaytime(Controllers.Schedule.getUseTimeForAsset(asset, day), { minutes: true, hours: true, days: true })}</Tooltip>}>
                    <span className='cursor-help'>
                      <ClockFill size={12} className='me-2' />
                      {getTimeUseIndicator(asset, day)}
                    </span>
                  </OverlayTrigger>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip style={{ position: 'fixed' }}><strong>Average seat utilization:</strong><br />{formatUtilization(Controllers.Schedule.getAverageUtilizationForAsset(asset, day))}</Tooltip>}>
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
            <TimetableHoursCol />
            {DaysOfWeek.map((day) =>
              <Col key={day} style={{ position: 'relative' }} className={`rounded-bottom bg-${Controllers.Clock.currentDayOfWeek === day ? 'danger bg-opacity-10' : 'body'}`}>
                <TimetableGrid />
                <div className='position-absolute bg-danger opacity-25' style={{ top: `${Controllers.Clock.playtime % Timeframes.DAY / 6 + 15}px`, width: '100%', height: '10px', margin: '0 -12px' }}></div>
                {Controllers.Schedule
                  .getTodaySchedulesForAsset(asset, day)
                  .sort((a, b) => (a.start < b.start ? -1 : 1))
                  .map((schedule) =>
                    <ScheduleCalendarItem
                      key={schedule.contract.id}
                      schedule={schedule}
                      tooltipPosition='top'
                      currentDayOfWeek={day}
                      onItemSelect={() => { handleItemSelect(schedule) }}
                      onItemDeselect={() => { handleItemDeselect() }}
                      isHighlighted={highlightedSchedule === schedule.contract.id} />
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
