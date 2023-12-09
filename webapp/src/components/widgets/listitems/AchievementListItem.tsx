import React from 'react'
import { AchievementType, type Achievement } from '../../../controllers/MissionController'
import { Card, Col } from 'react-bootstrap'
import { AirplaneEngines, CashStack, People, Star } from 'react-bootstrap-icons'
import { Clock } from '../../../controllers/helpers/Clock'

interface Props {
  item: { completedAt: number, achievement: Achievement }
}

const AchievementListItem: React.FC<Props> = ({ item }) => {
  return (
    <Col xs={4} className='d-flex'>
      <Card className='bg-grey-light rounded p-2 m-2 align-items-center text-center justify-content-center w-100'>
        {item.achievement.type === AchievementType.REPUTATION && <Star size={60} className='mb-2 text-badge-gold' />}
        {item.achievement.type === AchievementType.PROFIT && <CashStack size={60} className='mb-2 text-badge-gold' />}
        {item.achievement.type === AchievementType.FLEET_SIZE && <AirplaneEngines size={60} className='mb-2 text-badge-gold' />}
        {item.achievement.type === AchievementType.TOTAL_PASSENGERS && <People size={60} className='mb-2 text-badge-gold' />}
        <span className='fw-bold'>
          {item.achievement.label}
        </span>
        <span className='small'>
          {`${Clock.getFormattedTimeUntil(item.completedAt + Clock.getInstance().playtime)} in game`}
        </span>
      </Card>
    </Col>
  )
}

export default AchievementListItem
