import React from 'react'

import { Award, Trophy } from 'react-bootstrap-icons'
import ListPreviewWidget from '../widgets/ListPreviewWidget'
import { GameController } from '../../controllers/GameController'
import { type Achievement, type Mission } from '../../controllers/MissionController'
import MissionListItem from '../widgets/listitems/MissionListItem'
import AchievementListItem from '../widgets/listitems/AchievementListItem'
import RegionsWidget from '../widgets/RegionsWidget'

const Missions: React.FC = () => {
  const Controllers = GameController.getInstance()

  const missionsCount = Controllers.Mission.getMissionsCount()
  const achievementsCount = Controllers.Mission.getAchievementsCount()

  return (
    <>
      <RegionsWidget fullWidth />
      <ListPreviewWidget<{ completedAt: number, mission: Mission }>
          Icon={Trophy}
          header={'Missions'}
          counter={`(${missionsCount.completed}/${missionsCount.total})`}
          Component={MissionListItem}
          items={Controllers.Mission.getCurrentAndCompletedMissions()}
          maxHeight={'calc(100vh - 450px)'}
        />
        <ListPreviewWidget<{ completedAt: number, achievement: Achievement }>
          Icon={Award}
          header={'Achievements'}
          counter={`(${achievementsCount.completed}/${achievementsCount.total})`}
          Component={AchievementListItem}
          items={Controllers.Mission.getUnlockedAchievements()}
          maxHeight={'calc(100vh - 450px)'}
          wrapItems
        />
    </>
  )
}

export default Missions
