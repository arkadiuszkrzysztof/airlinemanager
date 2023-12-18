import React from 'react'
import { MissionType, type Mission } from '../../../controllers/MissionController'
import { Col, Row } from 'react-bootstrap'
import { ScheduleController } from '../../../controllers/ScheduleController'
import { Clock } from '../../../controllers/helpers/Clock'
import { CashStack, InfoCircle, Trophy } from 'react-bootstrap-icons'
import { formatCashValue } from '../../../controllers/helpers/Helpers'

interface Props {
  item: { completedAt: number, mission: Mission }
}

const MissionListItem: React.FC<Props> = ({ item }) => {
  if (item.completedAt === 0) {
    return (
      <Row className={'rounded my-3 mx-1'}>
        <Col xs={2} className='d-flex justify-content-center align-items-center'>
          <Trophy size={80} className='text-info' />
        </Col>
        <Col xs={10}>
          <div className='text-info small fw-bold'>{`ACTIVE MISSION ( PROGRESS: ${Math.floor(item.mission.conditions.currentValue / item.mission.conditions.expectedValue * 100)}%)`}</div>
          <div className='fs-4 fw-bold'>{item.mission.label}</div>
          <div className='fs-5'>Progress: <strong>{item.mission.conditions.currentValue.toLocaleString('en-US')}</strong> out of <strong>{item.mission.conditions.expectedValue.toLocaleString('en-US')}</strong></div>
          <div className='fs-5'>Reward at completion: <CashStack size={24} className='text-success mx-2 mb-1' /><strong className='text-success'>{formatCashValue(item.mission.reward)}</strong></div>
          {(item.mission.type === MissionType.DESTINATION || item.mission.type === MissionType.VISITS) && item.mission.conditions.destination !== undefined &&
            <div><InfoCircle size={16} className='me-2 mt-2' /><i>Active contracts to {item.mission.conditions.destination}: <strong>{ScheduleController.getInstance().getActiveSchedulesForDestination(item.mission.conditions.destination).length}</strong></i></div>}
          {item.mission.type === MissionType.AIRCRAFT && item.mission.conditions.aircraft !== undefined &&
            <div><InfoCircle size={16} className='me-2 mt-2' /><i>Active contracts on board of the {item.mission.conditions.aircraft}: <strong>{ScheduleController.getInstance().getActiveSchedulesForPlaneType(item.mission.conditions.aircraft).length}</strong></i></div>}
        </Col>
      </Row>
    )
  }

  return (
    <Row className={'bg-light bg-opacity-75 item-shadow rounded my-2 mx-1 p-2 border'}>
      <Col xs={'auto'} className='d-flex justify-content-center align-items-center'>
        <Trophy size={40} className='text-badge-gold' />
      </Col>
      <Col xs={'auto'}>
        <div className='fs-5 fw-bold'>{item.mission.label}</div>
        <div className='small'>Completed {`${Clock.getFormattedTimeUntil(item.completedAt + Clock.getInstance().playtime)} in game`}</div>
      </Col>
    </Row>
  )
}

export default MissionListItem
