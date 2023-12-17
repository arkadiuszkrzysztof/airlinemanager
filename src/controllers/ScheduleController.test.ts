import { type Schedule, ScheduleController } from './ScheduleController'
import { Clock, DaysOfWeek, Timeframes } from './helpers/Clock'
import { LocalStorage } from './helpers/LocalStorage'

const asset = { plane: { registration: 'ABC' } }
const contract = { startTime: 0 }

const Schedules: Array<{
  key: string
  start: number
  end: number
  option: { totalTime: number, asset: { plane: { registration: string } } }
  contract: { startTime: number }
}> = [
  { key: 'A', start: 1000, end: 2000, option: { totalTime: 1000, asset }, contract }, // MON-TUE
  { key: 'B', start: 1500, end: 2000, option: { totalTime: 500, asset }, contract }, // TUE
  { key: 'C', start: 2000, end: 2500, option: { totalTime: 500, asset }, contract }, // TUE
  { key: 'D', start: 4500, end: 7500, option: { totalTime: 3000, asset }, contract }, // THU-FRI-SAT
  { key: 'E', start: 5000, end: 6000, option: { totalTime: 1000, asset }, contract }, // THU-FRI
  { key: 'F', start: 6000, end: 6500, option: { totalTime: 500, asset }, contract }, // FRI
  { key: 'G', start: 6000, end: 7600, option: { totalTime: 1500, asset }, contract }, // FRI-SAT
  { key: 'H', start: 6500, end: 1200, option: { totalTime: 4780, asset }, contract }, // FRI-SAT-SUN-MON
  { key: 'I', start: 10000, end: 500, option: { totalTime: 580, asset }, contract }, // SUN-MON
  { key: 'J', start: 10000, end: 10050, option: { totalTime: 50, asset }, contract } // SUN
]

beforeAll(() => {
  jest.spyOn(LocalStorage, 'getActiveSchedules').mockReturnValue([])
  jest.spyOn(LocalStorage, 'getScheduleEvents').mockReturnValue([])
  jest.spyOn(LocalStorage, 'getContractsOffers').mockReturnValue([])
  jest.spyOn(LocalStorage, 'getInactiveContracts').mockReturnValue([])
  jest.spyOn(LocalStorage, 'getPlaytime').mockReturnValue(0)
  jest.spyOn(LocalStorage, 'getOfflineTime').mockReturnValue(0)
  jest.spyOn(LocalStorage, 'getLastSave').mockReturnValue(0)
  jest.spyOn(LocalStorage, 'setPlaytime').mockImplementation((_: number) => {})
  jest.spyOn(LocalStorage, 'setLastSave').mockImplementation((_: number) => {})
  jest.useFakeTimers()
  jest.spyOn(global, 'setInterval')

  jest.spyOn(ScheduleController.getInstance(), 'getActiveSchedules').mockReturnValue(Schedules as any)
})

describe('getTodaySchedules', () => {
  test('schedules for MON', () => {
    const todaySchedules = ScheduleController.getInstance().getTodaySchedules(DaysOfWeek[0])
    const todaySchedulesKeys = todaySchedules.map(schedule => (schedule as any).key)

    expect(todaySchedules.length).toBe(3)
    expect(todaySchedulesKeys).toContain('A')
    expect(todaySchedulesKeys).toContain('H')
    expect(todaySchedulesKeys).toContain('I')
  })

  test('schedules for TUE', () => {
    const todaySchedules = ScheduleController.getInstance().getTodaySchedules(DaysOfWeek[1])
    const todaySchedulesKeys = todaySchedules.map(schedule => (schedule as any).key)

    expect(todaySchedules.length).toBe(3)
    expect(todaySchedulesKeys).toContain('A')
    expect(todaySchedulesKeys).toContain('B')
    expect(todaySchedulesKeys).toContain('C')
  })

  test('no schedules for today - WED', () => {
    expect(ScheduleController.getInstance().getTodaySchedules(DaysOfWeek[2]).length).toBe(0)
  })

  test('schedules for THU', () => {
    const todaySchedules = ScheduleController.getInstance().getTodaySchedules(DaysOfWeek[3])
    const todaySchedulesKeys = todaySchedules.map(schedule => (schedule as any).key)

    expect(todaySchedules.length).toBe(2)
    expect(todaySchedulesKeys).toContain('D')
    expect(todaySchedulesKeys).toContain('E')
  })

  test('schedules for FRI', () => {
    const todaySchedules = ScheduleController.getInstance().getTodaySchedules(DaysOfWeek[4])
    const todaySchedulesKeys = todaySchedules.map(schedule => (schedule as any).key)

    expect(todaySchedules.length).toBe(5)
    expect(todaySchedulesKeys).toContain('D')
    expect(todaySchedulesKeys).toContain('E')
    expect(todaySchedulesKeys).toContain('F')
    expect(todaySchedulesKeys).toContain('G')
    expect(todaySchedulesKeys).toContain('H')
  })

  test('schedules for SAT', () => {
    const todaySchedules = ScheduleController.getInstance().getTodaySchedules(DaysOfWeek[5])
    const todaySchedulesKeys = todaySchedules.map(schedule => (schedule as any).key)

    expect(todaySchedules.length).toBe(3)
    expect(todaySchedulesKeys).toContain('D')
    expect(todaySchedulesKeys).toContain('G')
    expect(todaySchedulesKeys).toContain('H')
  })

  test('schedules for SUN', () => {
    const todaySchedules = ScheduleController.getInstance().getTodaySchedules(DaysOfWeek[6])
    const todaySchedulesKeys = todaySchedules.map(schedule => (schedule as any).key)

    expect(todaySchedules.length).toBe(3)
    expect(todaySchedulesKeys).toContain('H')
    expect(todaySchedulesKeys).toContain('I')
    expect(todaySchedulesKeys).toContain('J')
  })
})

describe('getTotalUseTime', () => {
  test('schedules for MON', () => {
    expect(ScheduleController.getInstance().getUseTimeForAsset(asset as any, DaysOfWeek[0])).toBe(2140)
  })

  test('schedules for TUE', () => {
    expect(ScheduleController.getInstance().getUseTimeForAsset(asset as any, DaysOfWeek[1])).toBe(1560)
  })

  test('schedules for WED', () => {
    expect(ScheduleController.getInstance().getUseTimeForAsset(asset as any, DaysOfWeek[2])).toBe(0)
  })

  test('schedules for THU', () => {
    expect(ScheduleController.getInstance().getUseTimeForAsset(asset as any, DaysOfWeek[3])).toBe(2020)
  })

  test('schedules for FRI', () => {
    expect(ScheduleController.getInstance().getUseTimeForAsset(asset as any, DaysOfWeek[4])).toBe(4080)
  })

  test('schedules for SAT', () => {
    expect(ScheduleController.getInstance().getUseTimeForAsset(asset as any, DaysOfWeek[5])).toBe(2140)
  })

  test('schedules for SUN', () => {
    expect(ScheduleController.getInstance().getUseTimeForAsset(asset as any, DaysOfWeek[6])).toBe(1570)
  })
})

describe('flightStatus', () => {
  test('flights on MON ', () => {
    jest.spyOn(Clock.getInstance(), 'playtime', 'get').mockReturnValue(Timeframes.WEEK * 5 + 1100)

    let flightStatus = ScheduleController.flightStatus(Schedules.filter(schedule => schedule.key === 'A')[0] as unknown as Schedule)
    expect(flightStatus.inTheAir).toBe(true)
    expect(flightStatus.flightLeg).toBe('there')

    flightStatus = ScheduleController.flightStatus(Schedules.filter(schedule => schedule.key === 'B')[0] as unknown as Schedule)
    expect(flightStatus.inTheAir).toBe(false)

    flightStatus = ScheduleController.flightStatus(Schedules.filter(schedule => schedule.key === 'H')[0] as unknown as Schedule)
    expect(flightStatus.inTheAir).toBe(true)
    expect(flightStatus.flightLeg).toBe('back')

    flightStatus = ScheduleController.flightStatus(Schedules.filter(schedule => schedule.key === 'I')[0] as unknown as Schedule)
    expect(flightStatus.inTheAir).toBe(false)
  })

  test('flights on SAT ', () => {
    jest.spyOn(Clock.getInstance(), 'playtime', 'get').mockReturnValue(Timeframes.WEEK * 5 + 7200 + 350)

    let flightStatus = ScheduleController.flightStatus(Schedules.filter(schedule => schedule.key === 'G')[0] as unknown as Schedule)
    expect(flightStatus.inTheAir).toBe(true)
    expect(flightStatus.flightLeg).toBe('back')

    flightStatus = ScheduleController.flightStatus(Schedules.filter(schedule => schedule.key === 'D')[0] as unknown as Schedule)
    expect(flightStatus.inTheAir).toBe(false)

    flightStatus = ScheduleController.flightStatus(Schedules.filter(schedule => schedule.key === 'H')[0] as unknown as Schedule)
    expect(flightStatus.inTheAir).toBe(true)
    expect(flightStatus.flightLeg).toBe('there')
  })
})
