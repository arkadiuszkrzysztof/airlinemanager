import { type Schedule } from '../ScheduleController'
import { Clock } from './Clock'

export interface Coordinates {
  latitude: number
  longitude: number
}

export const GreatCircle = {
  calculateDistance (pointA: Coordinates, pointB: Coordinates): number {
    const R = 6371000
    const φ1 = pointA.latitude * Math.PI / 180
    const φ2 = pointB.latitude * Math.PI / 180
    const Δφ = (pointB.latitude - pointA.latitude) * Math.PI / 180
    const Δλ = (pointB.longitude - pointA.longitude) * Math.PI / 180

    const a = Math.pow(Math.sin(Δφ / 2), 2) + Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin(Δλ / 2), 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.floor(R * c / 1000)
  },
  calculateMidpoint (pointA: Coordinates, pointB: Coordinates): Coordinates {
    const φ1 = pointA.latitude * Math.PI / 180
    const φ2 = pointB.latitude * Math.PI / 180
    const λ1 = pointA.longitude * Math.PI / 180
    const λ2 = pointB.longitude * Math.PI / 180
    const Δλ = λ2 - λ1

    const Bx = Math.cos(φ2) * Math.cos(Δλ)
    const By = Math.cos(φ2) * Math.sin(Δλ)

    const φ3 = Math.atan2(
      Math.sin(φ1) + Math.sin(φ2),
      Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By)
    )

    const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx)

    return {
      latitude: φ3 * 180 / Math.PI,
      longitude: λ3 * 180 / Math.PI
    }
  },
  getPathPoints (pointA: Coordinates, pointB: Coordinates): Coordinates[] {
    const midpoints: Coordinates[] = []

    const midpoint = this.calculateMidpoint(pointA, pointB)
    const midpointS = this.calculateMidpoint(pointA, midpoint)
    const midpointE = this.calculateMidpoint(midpoint, pointB)

    midpoints.push(pointA)
    midpoints.push(this.calculateMidpoint(pointA, midpointS))
    midpoints.push(midpointS)
    midpoints.push(this.calculateMidpoint(midpointS, midpoint))
    midpoints.push(midpoint)
    midpoints.push(this.calculateMidpoint(midpoint, midpointE))
    midpoints.push(midpointE)
    midpoints.push(this.calculateMidpoint(midpointE, pointB))
    midpoints.push(pointB)

    return midpoints
  },
  toRadians (degrees: number): number {
    return degrees * (Math.PI / 180)
  },
  calculateAngleWithXAxis (pointA: Coordinates, pointB: Coordinates): number {
    const lat1 = this.toRadians(pointA.latitude)
    const lon1 = this.toRadians(pointA.longitude)
    const lat2 = this.toRadians(pointB.latitude)
    const lon2 = this.toRadians(pointB.longitude)

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)

    const angle = Math.atan2(y, x)
    const azimuth = (angle >= 0 ? angle : (2 * Math.PI + angle)) * (180 / Math.PI)

    return azimuth
  },
  getCurrentPoint (schedule: Schedule): { coordinates: Coordinates, angle: number } {
    const points = this.getPathPoints(schedule.contract.hub.coordinates, schedule.contract.destination.coordinates)
    const startTime = Clock.getTimeAt(schedule.start)

    const progress = Math.abs(Clock.getInstance().playtime - startTime) / schedule.option.totalTime

    if (progress < 0.5) {
      const index = Math.min(Math.floor(progress * 2 * points.length), points.length - 1)
      const indexNext = Math.min(index + 1, points.length - 1)

      return {
        coordinates: points[index],
        angle: this.calculateAngleWithXAxis(points[index], points[indexNext])
      }
    } else {
      const index = Math.min(Math.floor((progress - 0.5) * 2 * points.length), points.length - 1)
      const indexNext = Math.min(index + 1, points.length - 1)

      return {
        coordinates: points[Math.max(points.length - 1 - index, 0)],
        angle: this.calculateAngleWithXAxis(points[Math.max(points.length - 1 - index, 0)], points[Math.max(points.length - 1 - indexNext)])
      }
    }
  }
}
