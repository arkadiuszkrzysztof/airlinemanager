import { GreatCircle, type Coordinates } from '../controllers/helpers/GreatCircle'

export type AirportTuple = [
  IATACode: string,
  location: string,
  country: string,
  countryCode: string,
  coordinates: Coordinates,
  longestRunway: number,
  passengers: number,
  feees: { landing: number, passenger: number }
]

export const AirportsData: Record<string, AirportTuple[]> = {
  EU: [
    ['KRK', 'Krakow', 'Poland', 'PL', { latitude: 50.077778, longitude: 19.784722 }, 2550, 7400000, { landing: 10, passenger: 7.5 }],
    ['WAW', 'Warsaw', 'Poland', 'PL', { latitude: 52.165833, longitude: 20.967222 }, 3690, 14400000, { landing: 10, passenger: 7.5 }],
    ['GDN', 'Gdansk', 'Poland', 'PL', { latitude: 54.3775, longitude: 18.466111 }, 2800, 4600000, { landing: 10, passenger: 7.5 }],
    ['LHR', 'London', 'United Kingdom', 'UK', { latitude: 51.470833, longitude: -0.460556 }, 3902, 61600000, { landing: 12.5, passenger: 42.5 }],
    ['AMS', 'Amsterdam', 'Netherlands', 'NL', { latitude: 52.308611, longitude: 4.763889 }, 3800, 52500000, { landing: 12.5, passenger: 42.5 }],
    ['CDG', 'Paris', 'France', 'FR', { latitude: 49.009722, longitude: 2.547778 }, 4200, 57500000, { landing: 12.5, passenger: 42.5 }],
    ['EDI', 'Edinburgh', 'United Kingdom', 'UK', { latitude: 55.95, longitude: -3.3725 }, 2556, 11250000, { landing: 9, passenger: 25 }],
    ['IST', 'Istanbul', 'Turkey', 'TR', { latitude: 41.262222, longitude: 28.727778 }, 4100, 64500000, { landing: 15, passenger: 25 }],
    ['KEF', 'Reykjavik', 'Iceland', 'IS', { latitude: 63.985, longitude: -22.605556 }, 3060, 6100000, { landing: 10, passenger: 7.5 }],
    ['ARN', 'Stockholm', 'Sweden', 'SE', { latitude: 59.651944, longitude: 17.918611 }, 3301, 18400000, { landing: 10, passenger: 7.5 }],
    ['SVO', 'Moscow', 'Russia', 'RU', { latitude: 55.972778, longitude: 37.414722 }, 3700, 28400000, { landing: 10, passenger: 7.5 }],
    ['MAD', 'Madrid', 'Spain', 'ES', { latitude: 40.472222, longitude: -3.560833 }, 4350, 50600000, { landing: 12.5, passenger: 42.5 }],
    ['LIS', 'Lisbon', 'Portugal', 'PT', { latitude: 38.774167, longitude: -9.134167 }, 3705, 28300000, { landing: 12.5, passenger: 42.5 }]
  ],
  NA: [
    ['JFK', 'New York', 'United States', 'US', { latitude: 40.639722, longitude: -73.778889 }, 4400, 61800000, { landing: 15, passenger: 25 }]
  ]
}

export const calculateAirportsDistance = (airport1: Airport, airport2: Airport): number => {
  return GreatCircle.calculateDistance(airport1.coordinates, airport2.coordinates)
}

export class Airport {
  constructor (
    public readonly IATACode: string,
    public readonly location: string,
    public readonly country: string,
    public readonly countryCode: string,
    public readonly coordinates: Coordinates,
    public readonly longestRunway: number,
    public readonly passengers: number,
    public readonly fees: {
      landing: number
      passenger: number
    }
  ) {}
}
