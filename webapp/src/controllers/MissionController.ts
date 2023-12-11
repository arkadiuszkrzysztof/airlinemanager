import { Regions } from '../models/Airport'
import { AirlineController } from './AirlineController'
import { HangarController } from './HangarController'
import { type Schedule } from './ScheduleController'
import { Clock } from './helpers/Clock'
import { LocalStorage } from './helpers/LocalStorage'

export enum AchievementType { TOTAL_PASSENGERS, FLEET_SIZE, REPUTATION, PROFIT }

export interface Achievement {
  id: string
  type: AchievementType
  label: string
  reward: number
  conditions: {
    reputation?: number
    fleetSize?: number
    totalPassengers?: number
    profit?: number
  }
}

const AchievementData: Achievement[] = [
  { id: 'REP010', type: AchievementType.REPUTATION, label: 'You just made your reputation double digit!', reward: 10000, conditions: { reputation: 10 } },
  { id: 'REP025', type: AchievementType.REPUTATION, label: 'Your airline has reputation of 25%', reward: 50000, conditions: { reputation: 25 } },
  { id: 'REP050', type: AchievementType.REPUTATION, label: 'Your airline has reputation of 50%', reward: 1000000, conditions: { reputation: 50 } },
  { id: 'REP075', type: AchievementType.REPUTATION, label: 'Your airline has reputation of 75%', reward: 5000000, conditions: { reputation: 75 } },
  { id: 'REP100', type: AchievementType.REPUTATION, label: 'Numero uno - your airline has reputation of 100%!', reward: 10000000, conditions: { reputation: 100 } },
  { id: 'PLA01', type: AchievementType.FLEET_SIZE, label: 'You\'ve got your first plane!', reward: 1000, conditions: { fleetSize: 1 } },
  { id: 'PLA05', type: AchievementType.FLEET_SIZE, label: 'You have 5 planes in the hangar!', reward: 25000, conditions: { fleetSize: 5 } },
  { id: 'PLA10', type: AchievementType.FLEET_SIZE, label: 'You have 10 planes in the hangar!', reward: 100000, conditions: { fleetSize: 10 } },
  { id: 'PLA15', type: AchievementType.FLEET_SIZE, label: 'You have 15 planes in the hangar!', reward: 250000, conditions: { fleetSize: 15 } },
  { id: 'PLA20', type: AchievementType.FLEET_SIZE, label: 'You have 20 planes in the hangar!', reward: 1000000, conditions: { fleetSize: 20 } },
  { id: 'PLA25', type: AchievementType.FLEET_SIZE, label: 'That\'s it! You maxed the hangar with 25 planes.', reward: 10000000, conditions: { fleetSize: 25 } },
  { id: 'PAS001K', type: AchievementType.TOTAL_PASSENGERS, label: 'Delivered first 1,000 passengers - way to go!', reward: 1000, conditions: { totalPassengers: 1000 } },
  { id: 'PAS025K', type: AchievementType.TOTAL_PASSENGERS, label: 'Delivered 25,000 passengers!', reward: 25000, conditions: { totalPassengers: 25000 } },
  { id: 'PAS100K', type: AchievementType.TOTAL_PASSENGERS, label: 'Delivered 100,000 passengers!', reward: 100000, conditions: { totalPassengers: 100000 } },
  { id: 'PAS500K', type: AchievementType.TOTAL_PASSENGERS, label: 'Delivered 500,000 passengers!', reward: 500000, conditions: { totalPassengers: 500000 } },
  { id: 'PAS001M', type: AchievementType.TOTAL_PASSENGERS, label: 'Delivered 1,000,000 passengers off the bat!', reward: 1000000, conditions: { totalPassengers: 1000000 } },
  { id: 'PAS010M', type: AchievementType.TOTAL_PASSENGERS, label: 'Wow - you just delivered 10,000,000 passengers! Just like that.', reward: 10000000, conditions: { totalPassengers: 10000000 } },
  { id: 'PRO100K', type: AchievementType.PROFIT, label: 'Earned first $100,000. Not bad!', reward: 1000, conditions: { profit: 100000 } },
  { id: 'PRO001M', type: AchievementType.PROFIT, label: 'Earned 1 Million in revenue', reward: 10000, conditions: { profit: 1000000 } },
  { id: 'PRO010M', type: AchievementType.PROFIT, label: 'Earned 10 Millions in revenue', reward: 100000, conditions: { profit: 10000000 } },
  { id: 'PRO100M', type: AchievementType.PROFIT, label: 'Earned 100 Millions in revenue', reward: 250000, conditions: { profit: 100000000 } },
  { id: 'PRO500M', type: AchievementType.PROFIT, label: 'Earned 500 Millions in revenue', reward: 1000000, conditions: { profit: 500000000 } },
  { id: 'PRO001B', type: AchievementType.PROFIT, label: 'Holly cow - you\'ve earned 1 Billion in total revenue!', reward: 10000000, conditions: { profit: 1000000000 } }
]

export enum MissionType { DESTINATION, VISITS, AIRCRAFT, PASSENGER_CLASS }

export interface Mission {
  id: string
  region?: Regions
  type: MissionType
  label: string
  reward: number
  resolver: (mission: Mission, schedule?: Schedule) => boolean
  conditions: {
    destination?: string
    aircraft?: string
    class?: 'economy' | 'business' | 'first'
    expectedValue: number
    currentValue: number
  }
}

const updateProgress = (mission: Mission): void => {
  const progress = LocalStorage.getMissionsProgress()
  progress[mission.id] = mission.conditions.currentValue
  LocalStorage.setMissionsProgress(progress)
}

const destinationResolver = (mission: Mission, schedule?: Schedule): boolean => {
  if (schedule !== undefined && schedule.contract.destination.IATACode === mission.conditions.destination) {
    // remove the ?? 300 when the records are migrated
    mission.conditions.currentValue += (schedule.option.numberOfPassengers.total ?? 300)
    updateProgress(mission)
  }

  return mission.conditions.currentValue >= mission.conditions.expectedValue
}

const aircraftResolver = (mission: Mission, schedule?: Schedule): boolean => {
  if (schedule !== undefined && schedule.option.asset.plane.typeName === mission.conditions.aircraft) {
    // remove the ?? 300 when the records are migrated
    mission.conditions.currentValue += (schedule.option.numberOfPassengers.total ?? 300)
    updateProgress(mission)
  }

  return mission.conditions.currentValue >= mission.conditions.expectedValue
}

const classResolver = (mission: Mission, schedule?: Schedule): boolean => {
  if (schedule !== undefined && mission.conditions.class !== undefined) {
    // remove the ?? 0 when the records are migrated
    mission.conditions.currentValue += (schedule.option.numberOfPassengers[mission.conditions.class] ?? 0)
    updateProgress(mission)
  }

  return mission.conditions.currentValue >= mission.conditions.expectedValue
}

const visitsResolver = (mission: Mission, schedule?: Schedule): boolean => {
  if (schedule !== undefined && schedule.contract.destination.IATACode === mission.conditions.destination) {
    mission.conditions.currentValue++
    updateProgress(mission)
  }

  return mission.conditions.currentValue >= mission.conditions.expectedValue
}

const MissionData: Mission[] = [
  { id: 'PLA-E170', type: MissionType.AIRCRAFT, label: 'Fly 10,000 passengers with the Embraer 170', reward: 100000, resolver: aircraftResolver, conditions: { aircraft: 'E170', expectedValue: 10000, currentValue: 0 } },
  { id: 'PAS-ECO', type: MissionType.PASSENGER_CLASS, label: 'Fly 50,000 passengers in economy class', reward: 100000, resolver: classResolver, conditions: { class: 'economy', expectedValue: 50000, currentValue: 0 } },
  { id: 'VIS-EDI', region: Regions.EU, type: MissionType.VISITS, label: 'Visit Edinburgh 10 times', reward: 100000, resolver: visitsResolver, conditions: { destination: 'EDI', expectedValue: 10, currentValue: 0 } },
  { id: 'DEST-CDG', region: Regions.EU, type: MissionType.DESTINATION, label: 'Fly 1,000 passengers to Paris Charles de Gaulle', reward: 100000, resolver: destinationResolver, conditions: { destination: 'CDG', expectedValue: 1000, currentValue: 0 } },
  { id: 'VIS-KRK', region: Regions.EU, type: MissionType.VISITS, label: 'Visit Krakow 10 times', reward: 100000, resolver: visitsResolver, conditions: { destination: 'KRK', expectedValue: 10, currentValue: 0 } },
  { id: 'DEST-LHR', region: Regions.EU, type: MissionType.DESTINATION, label: 'Fly 1,000 passengers to London Heathrow', reward: 100000, resolver: destinationResolver, conditions: { destination: 'LHR', expectedValue: 1000, currentValue: 0 } },
  { id: 'DEST-KEF', region: Regions.EU, type: MissionType.DESTINATION, label: 'Fly 1,000 passengers to Reykjavik', reward: 100000, resolver: destinationResolver, conditions: { destination: 'KEF', expectedValue: 1000, currentValue: 0 } },
  { id: 'PLA-A320', type: MissionType.AIRCRAFT, label: 'Fly 10,000 passengers with the Airbus A320', reward: 250000, resolver: aircraftResolver, conditions: { aircraft: 'A320', expectedValue: 10000, currentValue: 0 } },
  { id: 'VIS-LIS', region: Regions.EU, type: MissionType.VISITS, label: 'Visit Lisbon 50 times', reward: 250000, resolver: visitsResolver, conditions: { destination: 'LIS', expectedValue: 50, currentValue: 0 } },
  { id: 'PLA-B787', type: MissionType.AIRCRAFT, label: 'Fly 50,000 passengers with the Boeing 787', reward: 250000, resolver: aircraftResolver, conditions: { aircraft: '787', expectedValue: 50000, currentValue: 0 } },
  { id: 'PAS-BUS', type: MissionType.PASSENGER_CLASS, label: 'Fly 1,000 passengers in business class', reward: 250000, resolver: classResolver, conditions: { class: 'business', expectedValue: 1000, currentValue: 0 } },
  { id: 'DEST-IST', region: Regions.EU, type: MissionType.DESTINATION, label: 'Fly 100,000 passengers to Istanbul', reward: 250000, resolver: destinationResolver, conditions: { destination: 'IST', expectedValue: 100000, currentValue: 0 } },
  { id: 'PLA-B777', type: MissionType.AIRCRAFT, label: 'Fly 10,000 passengers with the Boeing 777', reward: 250000, resolver: aircraftResolver, conditions: { aircraft: '777', expectedValue: 10000, currentValue: 0 } },
  { id: 'DEST-AMS', region: Regions.EU, type: MissionType.DESTINATION, label: 'Fly 100,000 passengers to Amsterdam', reward: 250000, resolver: destinationResolver, conditions: { destination: 'AMS', expectedValue: 100000, currentValue: 0 } },
  { id: 'PAS-FIR', type: MissionType.PASSENGER_CLASS, label: 'Fly 1000 passengers in first class', reward: 500000, resolver: classResolver, conditions: { class: 'first', expectedValue: 1000, currentValue: 0 } },
  { id: 'PLA-B747', type: MissionType.AIRCRAFT, label: 'Fly 250,000 passengers with the Boeing 747', reward: 500000, resolver: aircraftResolver, conditions: { aircraft: '747', expectedValue: 250000, currentValue: 0 } },
  { id: 'VIS-ARN', region: Regions.EU, type: MissionType.VISITS, label: 'Visit Stockholm 100 times', reward: 500000, resolver: visitsResolver, conditions: { destination: 'ARN', expectedValue: 100, currentValue: 0 } },
  { id: 'PLA-B747', type: MissionType.AIRCRAFT, label: 'Fly 1,000,000 passengers with the Airbus A380', reward: 1000000, resolver: aircraftResolver, conditions: { aircraft: 'A380', expectedValue: 1000000, currentValue: 0 } }
]

export class MissionController {
  private _achievementsRemaining: Achievement[] = []
  private readonly _achievementsCompleted: Array<{ completedAt: number, achievement: Achievement }> = []

  private _missionsRemaining: Mission[] = []
  private readonly _missionsCompleted: Array<{ completedAt: number, mission: Mission }> = []

  private static instance: MissionController

  private constructor () {
    this._achievementsCompleted = LocalStorage.getAchievementsCompleted()
    this._achievementsRemaining = AchievementData
      .filter((a: Achievement) => !this._achievementsCompleted.map((ac) => ac.achievement.id).includes(a.id))

    this._missionsCompleted = LocalStorage.getMissionsCompleted()
    const progress = LocalStorage.getMissionsProgress()
    this._missionsRemaining = MissionData
      .filter((m: Mission) => !this._missionsCompleted.map((mc) => mc.mission.id).includes(m.id))
      .filter((m: Mission) => m.region === undefined || m.region === AirlineController.getInstance().startingRegion)
      .map((m: Mission) => ({ ...m, conditions: { ...m.conditions, currentValue: progress[m.id] ?? 0 } }))
  }

  public notifyMissions (schedule: Schedule): void {
    if (this._missionsRemaining?.[0] !== undefined) {
      const mission = this._missionsRemaining[0]
      if (mission.resolver(mission, schedule)) {
        this._missionsCompleted.push({ completedAt: Clock.getInstance().playtime, mission })
        this._missionsRemaining = this._missionsRemaining.filter(m => m.id !== mission.id)
        LocalStorage.setMissionsCompleted(this._missionsCompleted)

        AirlineController.getInstance().settleMission(mission)
      }
    }
  }

  public notifyAchievements (type: AchievementType): void {
    const airlineController = AirlineController.getInstance()
    const achievementsToNotify = this._achievementsRemaining.filter(achievement => achievement.type === type)

    const _completeAchievement = (achievement: Achievement): void => {
      this._achievementsCompleted.push({ completedAt: Clock.getInstance().playtime, achievement })
      this._achievementsRemaining = this._achievementsRemaining.filter(a => a.id !== achievement.id)
      LocalStorage.setAchievementsCompleted(this._achievementsCompleted)

      AirlineController.getInstance().settleAchievement(achievement)
    }

    switch (type) {
      case AchievementType.REPUTATION:
        achievementsToNotify.forEach(achievement => {
          if (achievement.conditions.reputation !== undefined && airlineController.reputation.totalCapped >= achievement.conditions.reputation) {
            _completeAchievement(achievement)
          }
        })
        break
      case AchievementType.FLEET_SIZE:
        achievementsToNotify.forEach(achievement => {
          if (achievement.conditions.fleetSize !== undefined && HangarController.getInstance().getAssetsCount() >= achievement.conditions.fleetSize) {
            _completeAchievement(achievement)
          }
        })
        break
      case AchievementType.TOTAL_PASSENGERS:
        achievementsToNotify.forEach(achievement => {
          if (achievement.conditions.totalPassengers !== undefined && airlineController.getTotalPassengers() >= achievement.conditions.totalPassengers) {
            _completeAchievement(achievement)
          }
        })
        break
      case AchievementType.PROFIT:
        achievementsToNotify.forEach(achievement => {
          if (achievement.conditions.profit !== undefined && airlineController.getTotalProfit() >= achievement.conditions.profit) {
            _completeAchievement(achievement)
          }
        })
        break
    }
  }

  public static getInstance (): MissionController {
    if (MissionController.instance === undefined) {
      MissionController.instance = new MissionController()
    }
    return MissionController.instance
  }

  public getCurrentAndCompletedMissions (): Array<{ completedAt: number, mission: Mission }> {
    return (this._missionsRemaining[0] !== undefined ? [{ mission: this._missionsRemaining[0], completedAt: 0 }] : []).concat([...this._missionsCompleted].reverse())
  }

  public getUnlockedAchievements (): Array<{ completedAt: number, achievement: Achievement }> {
    return [...this._achievementsCompleted].reverse()
  }

  public getAchievementsCount (): { completed: number, total: number } {
    return { completed: this._achievementsCompleted.length, total: AchievementData.length }
  }

  public getMissionsCount (): { completed: number, total: number } {
    return { completed: this._missionsCompleted.length, total: MissionData.length }
  }
}
