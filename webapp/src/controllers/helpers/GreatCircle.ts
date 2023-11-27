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
  }
}
