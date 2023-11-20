export type AirportTuple = [
  IATACode: string,
  location: string,
  country: string,
  countryCode: string,
  longestRunway: number,
  passengers: number,
  feees: { landing: number, passenger: number }
]

export const AirportsData: Record<string, AirportTuple[]> = {
  EU: [
    ['KRK', 'Krakow', 'Poland', 'PL', 2550, 7400000, { landing: 10, passenger: 7.5 }],
    ['WAW', 'Warsaw', 'Poland', 'PL', 3690, 14400000, { landing: 10, passenger: 7.5 }],
    ['GDN', 'Gdansk', 'Poland', 'PL', 2800, 4600000, { landing: 10, passenger: 7.5 }],
    ['LHR', 'London', 'United Kingdom', 'UK', 3902, 61600000, { landing: 12.5, passenger: 42.5 }],
    ['AMS', 'Amsterdam', 'Netherlands', 'NL', 3800, 52500000, { landing: 12.5, passenger: 42.5 }],
    ['CDG', 'Paris', 'France', 'FR', 4200, 57500000, { landing: 12.5, passenger: 42.5 }],
    ['EDI', 'Edinburgh', 'United Kingdom', 'UK', 2556, 11250000, { landing: 9, passenger: 25 }],
    ['IST', 'Istanbul', 'Turkey', 'TR', 4100, 64500000, { landing: 15, passenger: 25 }]
  ]
}

export const calculateAirportsDistance = (airport1: Airport, airport2: Airport): number => {
  enum IATACodes { 'KRK', 'WAW', 'GDN', 'LHR', 'AMS', 'CDG', 'EDI', 'IST' }

  const distances = [
    [0, 247, 487, 1428, 1074, 1247, 1671, 1201],
    [247, 0, 297, 1470, 1102, 1343, 1634, 1348],
    [487, 297, 0, 1305, 937, 1245, 1393, 1644],
    [1428, 1470, 1305, 0, 371, 348, 534, 2489],
    [1074, 1102, 937, 371, 0, 399, 667, 2185],
    [1247, 1343, 1245, 348, 399, 0, 869, 2214],
    [1671, 1634, 1393, 534, 667, 869, 0, 2831],
    [1201, 1348, 1644, 2489, 2185, 2214, 2831, 0]
  ]

  const key1 = IATACodes[airport1.IATACode as keyof typeof IATACodes]
  const key2 = IATACodes[airport2.IATACode as keyof typeof IATACodes]

  return distances[key1][key2]
}

export class Airport {
  constructor (
    public readonly IATACode: string,
    public readonly location: string,
    public readonly country: string,
    public readonly countryCode: string,
    public readonly longestRunway: number,
    public readonly passengers: number,
    public readonly fees: {
      landing: number
      passenger: number
    }
  ) {}
}
