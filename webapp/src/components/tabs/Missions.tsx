import React from 'react'

import { Award, Trophy } from 'react-bootstrap-icons'
import ListPreviewWidget from '../widgets/ListPreviewWidget'
import { type Controllers } from '../../controllers/GameController'
import { type Achievement, type Mission } from '../../controllers/MissionController'
import MissionListItem from '../widgets/listitems/MissionListItem'
import AchievementListItem from '../widgets/listitems/AchievementListItem'

interface Props {
  Controllers: Controllers
}

const Missions: React.FC<Props> = ({ Controllers }) => {
  const missionsCount = Controllers.Mission.getMissionsCount()
  const achievementsCount = Controllers.Mission.getAchievementsCount()

  return (
    <>
      <ListPreviewWidget<{ completedAt: number, mission: Mission }>
          Icon={Trophy}
          header={`Missions (${missionsCount.completed}/${missionsCount.total})`}
          Component={MissionListItem}
          items={Controllers.Mission.getCurrentAndCompletedMissions()}
          fullHeight
        />
        <ListPreviewWidget<{ completedAt: number, achievement: Achievement }>
          Icon={Award}
          header={`Achievements (${achievementsCount.completed}/${achievementsCount.total})`}
          Component={AchievementListItem}
          items={Controllers.Mission.getUnlockedAchievements()}
          fullHeight
          wrapItems
        />
    </>
  )
}

export default Missions