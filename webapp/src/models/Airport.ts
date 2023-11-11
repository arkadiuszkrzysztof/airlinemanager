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
    ['KRK', 'Krakow', 'Poland', 'PL', 2550, 7400000, { landing: 40, passenger: 30 }],
    ['WAW', 'Warsaw', 'Poland', 'PL', 3690, 14400000, { landing: 40, passenger: 30 }],
    ['GDN', 'Gdansk', 'Poland', 'PL', 2800, 4600000, { landing: 40, passenger: 30 }],
    ['LHR', 'London', 'United Kingdom', 'UK', 3902, 61600000, { landing: 50, passenger: 170 }],
    ['AMS', 'Amsterdam', 'Netherlands', 'NL', 3800, 52500000, { landing: 50, passenger: 170 }],
    ['CDG', 'Paris', 'France', 'FR', 4200, 57500000, { landing: 50, passenger: 170 }]
  ]
}

export const calculateAirportsDistance = (airport1: Airport, airport2: Airport): number => {
  enum IATACodes { 'KRK', 'WAW', 'GDN', 'LHR', 'AMS', 'CDG' }

  const distances = [
    [0, 247, 487, 1428, 1074, 1247],
    [247, 0, 297, 1470, 1102, 1343],
    [487, 297, 0, 1305, 937, 1245],
    [1428, 1470, 1305, 0, 371, 348],
    [1074, 1102, 937, 371, 0, 399],
    [1247, 1343, 1245, 348, 399, 0]
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
