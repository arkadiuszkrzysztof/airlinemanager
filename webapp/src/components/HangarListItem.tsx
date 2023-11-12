import React from 'react'
import { Row, Col, Badge } from 'react-bootstrap'
import { type HangarAsset } from '../controllers/HangarController'
import { GameController } from '../controllers/GameController'
import { Clock, DaysOfWeek } from '../controllers/Clock'
import { type Schedule } from '../controllers/ScheduleController'
import { AirplaneFill } from 'react-bootstrap-icons'

interface Props {
  item: HangarAsset
}

const HangarListItem: React.FC<Props> = ({ item: asset }) => {
  const Controllers = GameController.getInstance()

  const flightStatus = (schedule: Schedule): { inTheAir: boolean, flightLeg: 'there' | 'back' } => {
    let inTheAir = false
    let flightLeg: 'there' | 'back' = 'there'

    const halftime = Clock.addToTime(schedule.start, Math.floor(schedule.option.turnaround / 2))

    if (schedule.day === Controllers.Clock.currentDayOfWeek && Clock.isCurrentTimeBetween(schedule.start, schedule.end)) {
      inTheAir = true

      if (Controllers.Clock.playtimeFormatted > halftime) {
        flightLeg = 'back'
      }
    }

    return { inTheAir, flightLeg }
  }

  return (
    <Row className='bg-grey-light rounded mt-2 p-2'>
      <Col xs={12}>
        <div className='d-flex align-items-center'>
          {`${asset.plane.familyName} ${asset.plane.typeName} [${asset.plane.registration}]`}
          <Badge bg={asset.ownership === 'owned' ? 'dark' : 'light'} className='ms-2'>
            {asset.ownership.toUpperCase()}
          </Badge>
        </div>
      </Col>
      <Col xs={12}>
        <Row className='align-items-start pt-2'>
          {Object.values(DaysOfWeek).map((day) =>
            <Col key={day} className={`d-flex flex-column justify-content-center rounded bg-${Controllers.Clock.currentDayOfWeek === day ? 'body' : 'grey-light'}`}>
              <p className='text-center fw-bold text-dark'>{day}</p>
              {Controllers.Schedule
                .getActiveSchedulesForAsset(asset)
                .filter((schedule) => schedule.day === day)
                .sort((a, b) => (a.start < b.start ? -1 : 1))
                .map((schedule) =>
                <Row key={Math.random()} className='text-center'>
                  <p>
                    {`${schedule.start} - ${schedule.end}`}<br />
                    {schedule.contract.hub.IATACode}
                    {flightStatus(schedule).inTheAir
                      ? flightStatus(schedule).flightLeg === 'there'
                        ? <AirplaneFill size={12} className='text-warning mx-2 rotate-90 pulse-animation'/>
                        : <AirplaneFill size={12} className='text-warning mx-2 rotate-270 pulse-animation'/>
                      : ' -- '}
                    {schedule.contract.destination.IATACode}
                  </p>
                </Row>
                )}
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  )
}

export default HangarListItem
