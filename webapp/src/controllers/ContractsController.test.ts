import { ContractsController } from './ContractsController'
import { LocalStorage } from './helpers/LocalStorage'

beforeAll(() => {
  jest.spyOn(LocalStorage, 'getContractsOffers').mockReturnValue([])
  jest.spyOn(LocalStorage, 'getInactiveContracts').mockReturnValue([])
})

describe('canAssignSchedule - no wrapping', () => {
  test('schedules are shifted and overlapping', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 3000, end: 4000 }], { start: 3500, end: 4500 })).toBe(false)
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 3000, end: 4000 }], { start: 2500, end: 3500 })).toBe(false)
  })

  test('overlapping just for last minute', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 3000, end: 4000 }], { start: 4000, end: 4500 })).toBe(false)
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 3000, end: 4000 }], { start: 2000, end: 3000 })).toBe(false)
  })

  test('schedules are shifted, no overlapping', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 3000, end: 3500 }], { start: 4000, end: 4500 })).toBe(true)
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 3000, end: 3500 }], { start: 1000, end: 2000 })).toBe(true)
  })

  test('proposed schedule covers entirely active schedule', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 3000, end: 4000 }], { start: 2500, end: 4500 })).toBe(false)
  })

  test('proposed schedule fits entirely in active schedule', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 3000, end: 4000 }], { start: 3200, end: 3800 })).toBe(false)
  })
})

describe('canAssignSchedule - wrapping', () => {
  test('proposed schedule overlaps with active schedule that wraps Sunday-Monday', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 9000, end: 1000 }], { start: 8500, end: 9300 })).toBe(false)
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 9000, end: 1000 }], { start: 8500, end: 500 })).toBe(false)
  })

  test('proposed schedule that wraps Sunday-Monday overlaps with active schedule', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 9200, end: 9500 }], { start: 9300, end: 500 })).toBe(false)
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 300, end: 1000 }], { start: 9300, end: 500 })).toBe(false)
  })

  test('proposed schedule fits inside active schedule that wraps Sunday-Monday', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 9000, end: 1000 }], { start: 9200, end: 9500 })).toBe(false)
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 9000, end: 1000 }], { start: 200, end: 500 })).toBe(false)
  })

  test('proposed schedule that wraps Sunday-Monday fits inside active schedule', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 9000, end: 1000 }], { start: 9500, end: 500 })).toBe(false)
  })

  test('wrapping but no overlapping', () => {
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 9000, end: 100 }], { start: 200, end: 500 })).toBe(true)
    expect(ContractsController.getInstance().canAssignSchedule([{ start: 200, end: 500 }], { start: 9000, end: 100 })).toBe(true)
  })
})
