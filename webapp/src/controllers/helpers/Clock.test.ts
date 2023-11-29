import { type Schedule } from '../ScheduleController'
import { Clock, DaysOfWeek, Timeframes } from './Clock'
import { LocalStorage } from './LocalStorage'

describe('clock manipulation', () => {
  test('add time to minutes only', () => {
    expect(Clock.addToTime('06:20', 10)).toBe('06:30')
  })

  test('add time to hours only', () => {
    expect(Clock.addToTime('06:20', 60)).toBe('07:20')
  })

  test('add time to hours and minutes', () => {
    expect(Clock.addToTime('06:20', 70)).toBe('07:30')
  })

  test('add time to hours and minutes that exceeds minutes', () => {
    expect(Clock.addToTime('06:20', 115)).toBe('08:15')
  })

  test('add time to hours and minutes that exceeds hours', () => {
    expect(Clock.addToTime('18:20', 470)).toBe('02:10')
  })

  test('add time to negative minutes', () => {
    expect(Clock.addToTime('06:20', -10)).toBe('06:10')
  })

  test('add time to negative hours', () => {
    expect(Clock.addToTime('06:20', -60)).toBe('05:20')
  })

  test('add time to negative hours and minutes', () => {
    expect(Clock.addToTime('06:20', -70)).toBe('05:10')
  })

  test('add time to negative hours and minutes that exceeds minutes', () => {
    expect(Clock.addToTime('06:20', -95)).toBe('04:45')
  })

  test('add time to negative hours and minutes that exceeds hours', () => {
    expect(Clock.addToTime('03:20', -365)).toBe('21:15')
  })
})

describe('timerange manipulation', () => {
  beforeEach(() => {
    jest.spyOn(LocalStorage, 'getPlaytime').mockReturnValueOnce(0)
    jest.spyOn(LocalStorage, 'getOfflineTime').mockReturnValue(0)
    jest.spyOn(LocalStorage, 'getLastSave').mockReturnValue(0)
    Clock.getInstance()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('current time is between two times', () => {
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('17:45')
    expect(Clock.isCurrentTimeBetween('17:00', '18:00')).toBe(true)
  })

  test('current time is before the range', () => {
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('17:45')
    expect(Clock.isCurrentTimeBetween('18:00', '19:00')).toBe(false)
  })

  test('current time is after the range', () => {
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('17:45')
    expect(Clock.isCurrentTimeBetween('16:00', '17:00')).toBe(false)
  })

  test('current time is before midnight and between two times that wrap around midnight', () => {
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('23:35')
    expect(Clock.isCurrentTimeBetween('23:00', '01:00')).toBe(true)
  })

  test('current time is after midnight and between two times that wrap around midnight', () => {
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('00:15')
    expect(Clock.isCurrentTimeBetween('23:00', '01:00')).toBe(true)
  })

  test('current time is before midnight and not between two times that wrap around midnight', () => {
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('23:35')
    expect(Clock.isCurrentTimeBetween('23:55', '02:00')).toBe(false)
  })

  test('current time is after midnight and not between two times that wrap around midnight', () => {
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('03:15')
    expect(Clock.isCurrentTimeBetween('23:55', '02:00')).toBe(false)
  })
})

describe('duration helper', () => {
  beforeEach(() => {
    jest.spyOn(LocalStorage, 'getPlaytime').mockReturnValueOnce(0)
    jest.spyOn(LocalStorage, 'getOfflineTime').mockReturnValue(0)
    jest.spyOn(LocalStorage, 'getLastSave').mockReturnValue(0)
    Clock.getInstance()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('get start time for tomorrow', () => {
    jest.spyOn(Clock.getInstance(), 'currentDayOfWeek', 'get').mockReturnValue('Wednesday')
    jest.spyOn(Clock.getInstance(), 'timeThisDayStart', 'get').mockReturnValue(Timeframes.DAY * 3)

    expect(Clock.getTimeClosestDayStart(DaysOfWeek.THURSDAY)).toBe(Timeframes.DAY * 4)
  })

  test('get start time in three days', () => {
    jest.spyOn(Clock.getInstance(), 'currentDayOfWeek', 'get').mockReturnValue('Wednesday')
    jest.spyOn(Clock.getInstance(), 'timeThisDayStart', 'get').mockReturnValue(Timeframes.DAY * 3)

    expect(Clock.getTimeClosestDayStart(DaysOfWeek.SATURDAY)).toBe(Timeframes.DAY * 6)
  })

  test('get start time in six days', () => {
    jest.spyOn(Clock.getInstance(), 'currentDayOfWeek', 'get').mockReturnValue('Wednesday')
    jest.spyOn(Clock.getInstance(), 'timeThisDayStart', 'get').mockReturnValue(Timeframes.DAY * 3)

    expect(Clock.getTimeClosestDayStart(DaysOfWeek.TUESDAY)).toBe(Timeframes.DAY * 9)
  })

  test('get start time in a week', () => {
    jest.spyOn(Clock.getInstance(), 'currentDayOfWeek', 'get').mockReturnValue('Wednesday')
    jest.spyOn(Clock.getInstance(), 'timeThisDayStart', 'get').mockReturnValue(Timeframes.DAY * 3)

    expect(Clock.getTimeClosestDayStart(DaysOfWeek.WEDNESDAY)).toBe(Timeframes.DAY * 10)
  })
})

describe('flight status verification', () => {
  const Schedules = {
    TUE_TO_WED: {
      day: DaysOfWeek.TUESDAY,
      start: '21:37',
      end: '04:20',
      contract: undefined,
      option: { totalTime: 403 }
    },
    WED_TO_THU: {
      day: DaysOfWeek.WEDNESDAY,
      start: '21:37',
      end: '04:20',
      contract: undefined,
      option: { totalTime: 403 }
    }
  }

  beforeEach(() => {
    jest.spyOn(LocalStorage, 'getPlaytime').mockReturnValueOnce(0)
    jest.spyOn(LocalStorage, 'getOfflineTime').mockReturnValue(0)
    jest.spyOn(LocalStorage, 'getLastSave').mockReturnValue(0)
    Clock.getInstance()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('flight is active - TUE-end', () => {
    jest.spyOn(Clock.getInstance(), 'currentDayOfWeek', 'get').mockReturnValue(DaysOfWeek.TUESDAY)
    jest.spyOn(Clock.getInstance(), 'previousDayOfWeek', 'get').mockReturnValue(DaysOfWeek.MONDAY)
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('21:37')

    expect(Clock.flightStatus(Schedules.TUE_TO_WED as unknown as Schedule).inTheAir).toBe(true)
  })

  test('flight is active - WED-start', () => {
    jest.spyOn(Clock.getInstance(), 'currentDayOfWeek', 'get').mockReturnValue(DaysOfWeek.WEDNESDAY)
    jest.spyOn(Clock.getInstance(), 'previousDayOfWeek', 'get').mockReturnValue(DaysOfWeek.TUESDAY)
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('00:37')

    expect(Clock.flightStatus(Schedules.TUE_TO_WED as unknown as Schedule).inTheAir).toBe(true)
    expect(Clock.flightStatus(Schedules.WED_TO_THU as unknown as Schedule).inTheAir).toBe(false)
  })

  test('flight is active - WED-end', () => {
    jest.spyOn(Clock.getInstance(), 'currentDayOfWeek', 'get').mockReturnValue(DaysOfWeek.WEDNESDAY)
    jest.spyOn(Clock.getInstance(), 'previousDayOfWeek', 'get').mockReturnValue(DaysOfWeek.TUESDAY)
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('21:37')

    expect(Clock.flightStatus(Schedules.TUE_TO_WED as unknown as Schedule).inTheAir).toBe(false)
    expect(Clock.flightStatus(Schedules.WED_TO_THU as unknown as Schedule).inTheAir).toBe(true)
  })

  test('flight is active - THU-start', () => {
    jest.spyOn(Clock.getInstance(), 'currentDayOfWeek', 'get').mockReturnValue(DaysOfWeek.THURSDAY)
    jest.spyOn(Clock.getInstance(), 'previousDayOfWeek', 'get').mockReturnValue(DaysOfWeek.WEDNESDAY)
    jest.spyOn(Clock.getInstance(), 'playtimeFormatted', 'get').mockReturnValue('00:37')

    expect(Clock.flightStatus(Schedules.WED_TO_THU as unknown as Schedule).inTheAir).toBe(true)
  })
})
