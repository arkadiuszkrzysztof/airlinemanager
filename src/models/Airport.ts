import { GreatCircle, type Coordinates } from '../controllers/helpers/GreatCircle'

export enum Regions {
  NA = 'North America',
  EU = 'Europe',
  ASIA = 'Asia',
  LATAM = 'Latin America',
  AFRICA = 'Africa',
  OCEANIA = 'Oceania'
}

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

export const AirportsData: Record<keyof typeof Regions, AirportTuple[]> = {
  NA: [
    ['ATL', 'Atlanta', 'United States', 'US', { latitude: 33.636667, longitude: -84.428056 }, 3776, 110500000, { landing: 15, passenger: 25 }],
    ['LAX', 'Los Angeles', 'United States', 'US', { latitude: 33.9425, longitude: -118.408056 }, 3939, 88000000, { landing: 15, passenger: 25 }],
    ['ORD', 'Chicago', 'United States', 'US', { latitude: 41.978611, longitude: -87.904722 }, 3962, 88000000, { landing: 15, passenger: 25 }],
    ['DFW', 'Dallas', 'United States', 'US', { latitude: 32.896944, longitude: -97.038056 }, 4085, 75000000, { landing: 15, passenger: 25 }],
    ['DEN', 'Denver', 'United States', 'US', { latitude: 39.861667, longitude: -104.673056 }, 4877, 69000000, { landing: 15, passenger: 25 }],
    ['JFK', 'New York', 'United States', 'US', { latitude: 40.639722, longitude: -73.778889 }, 4423, 62500000, { landing: 15, passenger: 25 }],
    ['SFO', 'San Francisco', 'United States', 'US', { latitude: 37.618889, longitude: -122.375 }, 3618, 57500000, { landing: 15, passenger: 25 }],
    ['SEA', 'Seattle', 'United States', 'US', { latitude: 47.448889, longitude: -122.309444 }, 3627, 51800000, { landing: 15, passenger: 25 }],
    ['LAS', 'Las Vegas', 'United States', 'US', { latitude: 36.08, longitude: -115.152222 }, 4424, 51700000, { landing: 15, passenger: 25 }],
    ['MCO', 'Orlando', 'United States', 'US', { latitude: 28.429444, longitude: -81.308889 }, 3659, 50600000, { landing: 15, passenger: 25 }],
    ['YVR', 'Vancouver', 'Canada', 'CA', { latitude: 49.194722, longitude: -123.183889 }, 3293, 26400000, { landing: 10, passenger: 7.5 }],
    ['CUN', 'Cancun', 'Mexico', 'MX', { latitude: 21.036667, longitude: -86.876944 }, 3500, 25500000, { landing: 10, passenger: 7.5 }],
    ['YUL', 'Montreal', 'Canada', 'CA', { latitude: 45.470556, longitude: -73.740833 }, 3353, 20300000, { landing: 10, passenger: 7.5 }],
    ['YYZ', 'Toronto', 'Canada', 'CA', { latitude: 43.676667, longitude: -79.630556 }, 3389, 50500000, { landing: 10, passenger: 7.5 }],
    ['MEX', 'Mexico City', 'Mexico', 'MX', { latitude: 19.436111, longitude: -99.071944 }, 3952, 50300000, { landing: 10, passenger: 7.5 }],
    ['YYC', 'Calgary', 'Canada', 'CA', { latitude: 51.1225, longitude: -114.013333 }, 4267, 18000000, { landing: 10, passenger: 7.5 }],
    ['GDL', 'Guadalajara', 'Mexico', 'MX', { latitude: 20.521667, longitude: -103.311111 }, 4000, 14800000, { landing: 10, passenger: 7.5 }],
    ['HNL', 'Honolulu', 'United States', 'US', { latitude: 21.318611, longitude: -157.9225 }, 3753, 21700000, { landing: 15, passenger: 25 }],
    ['NAS', 'Nassau', 'Bahamas', 'BS', { latitude: 25.038889, longitude: -77.466111 }, 3358, 4100000, { landing: 10, passenger: 7.5 }],
    ['ABQ', 'Albuquerque', 'United States', 'US', { latitude: 35.039333, longitude: -106.610778 }, 4204, 5500000, { landing: 15, passenger: 25 }],
    ['MSP', 'Minneapolis', 'United States', 'US', { latitude: 44.881944, longitude: -93.221667 }, 3355, 39500000, { landing: 15, passenger: 25 }],
    ['SLC', 'Salt Lake City', 'United States', 'US', { latitude: 40.788333, longitude: -111.977778 }, 3658, 26800000, { landing: 15, passenger: 25 }],
    ['IND', 'Indianapolis', 'United States', 'US', { latitude: 39.717222, longitude: -86.294444 }, 3414, 9500000, { landing: 15, passenger: 25 }],
    ['MCI', 'Kansas City', 'United States', 'US', { latitude: 39.2975, longitude: -94.713889 }, 3292, 11800000, { landing: 15, passenger: 25 }]
  ],
  EU: [
    ['KRK', 'Krakow', 'Poland', 'PL', { latitude: 50.077778, longitude: 19.784722 }, 2550, 7400000, { landing: 10, passenger: 7.5 }],
    ['WAW', 'Warsaw', 'Poland', 'PL', { latitude: 52.165833, longitude: 20.967222 }, 3690, 14400000, { landing: 10, passenger: 7.5 }],
    ['LHR', 'London', 'United Kingdom', 'UK', { latitude: 51.470833, longitude: -0.460556 }, 3902, 61600000, { landing: 12.5, passenger: 42.5 }],
    ['AMS', 'Amsterdam', 'Netherlands', 'NL', { latitude: 52.308611, longitude: 4.763889 }, 3800, 52500000, { landing: 12.5, passenger: 42.5 }],
    ['CDG', 'Paris', 'France', 'FR', { latitude: 49.009722, longitude: 2.547778 }, 4200, 57500000, { landing: 12.5, passenger: 42.5 }],
    ['EDI', 'Edinburgh', 'United Kingdom', 'UK', { latitude: 55.95, longitude: -3.3725 }, 2556, 11250000, { landing: 9, passenger: 25 }],
    ['IST', 'Istanbul', 'Turkey', 'TR', { latitude: 41.262222, longitude: 28.727778 }, 4100, 64500000, { landing: 15, passenger: 25 }],
    ['KEF', 'Reykjavik', 'Iceland', 'IS', { latitude: 63.985, longitude: -22.605556 }, 3060, 6100000, { landing: 10, passenger: 7.5 }],
    ['ARN', 'Stockholm', 'Sweden', 'SE', { latitude: 59.651944, longitude: 17.918611 }, 3301, 18400000, { landing: 10, passenger: 7.5 }],
    ['SVO', 'Moscow', 'Russia', 'RU', { latitude: 55.972778, longitude: 37.414722 }, 3700, 28400000, { landing: 10, passenger: 7.5 }],
    ['MAD', 'Madrid', 'Spain', 'ES', { latitude: 40.472222, longitude: -3.560833 }, 4350, 50600000, { landing: 12.5, passenger: 42.5 }],
    ['LIS', 'Lisbon', 'Portugal', 'PT', { latitude: 38.774167, longitude: -9.134167 }, 3705, 28300000, { landing: 12.5, passenger: 42.5 }],
    ['FRA', 'Frankfurt', 'Germany', 'DE', { latitude: 50.033333, longitude: 8.570556 }, 4000, 49000000, { landing: 12.5, passenger: 42.5 }],
    ['FCO', 'Rome', 'Italy', 'IT', { latitude: 41.800278, longitude: 12.238889 }, 3900, 29000000, { landing: 12.5, passenger: 42.5 }],
    ['PMI', 'Palma', 'Spain', 'ES', { latitude: 39.551667, longitude: 2.738889 }, 3270, 28500000, { landing: 12.5, passenger: 42.5 }],
    ['DUB', 'Dublin', 'Ireland', 'IE', { latitude: 53.421389, longitude: -6.270833 }, 3110, 27800000, { landing: 9, passenger: 25 }],
    ['ATH', 'Athens', 'Greece', 'GR', { latitude: 37.936389, longitude: 23.947222 }, 4000, 22700000, { landing: 12.5, passenger: 42.5 }],
    ['BER', 'Berlin', 'Germany', 'DE', { latitude: 52.366667, longitude: 13.503333 }, 4000, 19800000, { landing: 12.5, passenger: 42.5 }],
    ['HEL', 'Helsinki', 'Finland', 'FI', { latitude: 60.317222, longitude: 24.963333 }, 3500, 12900000, { landing: 10, passenger: 7.5 }],
    ['OSL', 'Oslo', 'Norway', 'NO', { latitude: 60.202778, longitude: 11.083889 }, 3600, 22500000, { landing: 10, passenger: 7.5 }],
    ['MXP', 'Milan', 'Italy', 'IT', { latitude: 45.63, longitude: 8.723056 }, 3920, 9600000, { landing: 12.5, passenger: 42.5 }],
    ['OTP', 'Bucharest', 'Romania', 'RO', { latitude: 44.571111, longitude: 26.085 }, 3500, 6900000, { landing: 10, passenger: 7.5 }],
    ['KBP', 'Kiev', 'Ukraine', 'UA', { latitude: 50.344722, longitude: 30.893333 }, 4000, 15300000, { landing: 10, passenger: 7.5 }],
    ['VNO', 'Vilnius', 'Lithuania', 'LT', { latitude: 54.636944, longitude: 25.287778 }, 2515, 4900000, { landing: 10, passenger: 7.5 }]
  ],
  ASIA: [
    ['PEK', 'Beijing', 'China', 'CN', { latitude: 40.08, longitude: 116.584444 }, 3800, 100000000, { landing: 15, passenger: 25 }],
    ['DXB', 'Dubai', 'United Arab Emirates', 'AE', { latitude: 25.252778, longitude: 55.364444 }, 4400, 89000000, { landing: 15, passenger: 25 }],
    ['HND', 'Tokyo', 'Japan', 'JP', { latitude: 35.552222, longitude: 139.779722 }, 2500, 87000000, { landing: 15, passenger: 25 }],
    ['DEL', 'Delhi', 'India', 'IN', { latitude: 28.566667, longitude: 77.1 }, 4430, 69000000, { landing: 15, passenger: 25 }],
    ['ICN', 'Seoul', 'South Korea', 'KR', { latitude: 37.469167, longitude: 126.450556 }, 3962, 68000000, { landing: 15, passenger: 25 }]
  ],
  LATAM: [
    ['PTY', 'Panama City', 'Panama', 'PA', { latitude: 9.071389, longitude: -79.383611 }, 3050, 16600000, { landing: 10, passenger: 7.5 }],
    ['SJO', 'San Jose', 'Costa Rica', 'CR', { latitude: 9.993889, longitude: -84.208889 }, 3012, 5000000, { landing: 10, passenger: 7.5 }],
    ['SAL', 'San Salvador', 'El Salvador', 'SV', { latitude: 13.440833, longitude: -89.055556 }, 3200, 3400000, { landing: 10, passenger: 7.5 }],
    ['GUA', 'Guatemala City', 'Guatemala', 'GT', { latitude: 14.581667, longitude: -90.526667 }, 2987, 2800000, { landing: 10, passenger: 7.5 }],
    ['BZE', 'Belize City', 'Belize', 'BZ', { latitude: 17.539167, longitude: -88.308333 }, 2950, 1100000, { landing: 10, passenger: 7.5 }],
    ['LIR', 'Liberia', 'Costa Rica', 'CR', { latitude: 10.593056, longitude: -85.545556 }, 2750, 1400000, { landing: 10, passenger: 7.5 }]
    // kuba dominikana portoryko jamajka
  ],
  AFRICA: [
    ['CAI', 'Cairo', 'Egypt', 'EG', { latitude: 30.121944, longitude: 31.405556 }, 4000, 20000000, { landing: 10, passenger: 7.5 }],
    ['JNB', 'Johannesburg', 'South Africa', 'ZA', { latitude: -26.133333, longitude: 28.25 }, 4421, 14800000, { landing: 10, passenger: 7.5 }],
    ['LPA', 'Las Palmas', 'Spain', 'ES', { latitude: 27.931944, longitude: -15.386667 }, 3100, 12400000, { landing: 12.5, passenger: 42.5 }],
    ['TFS', 'Tenerife', 'Spain', 'ES', { latitude: 28.044444, longitude: -16.5725 }, 3200, 10800000, { landing: 12.5, passenger: 42.5 }],
    ['CPT', 'Cape Town', 'South Africa', 'ZA', { latitude: -33.969444, longitude: 18.597222 }, 3201, 7900000, { landing: 10, passenger: 7.5 }],
    ['CMN', 'Casablanca', 'Morocco', 'MA', { latitude: 33.367222, longitude: -7.589722 }, 3720, 7600000, { landing: 10, passenger: 7.5 }],
    ['ACE', 'Lanzarote', 'Spain', 'ES', { latitude: 28.945556, longitude: -13.605278 }, 2400, 7400000, { landing: 12.5, passenger: 42.5 }],
    ['HRG', 'Hurghada', 'Egypt', 'EG', { latitude: 27.178056, longitude: 33.799167 }, 4000, 7200000, { landing: 10, passenger: 7.5 }],
    ['ADD', 'Addis Ababa', 'Ethiopia', 'ET', { latitude: 8.977778, longitude: 38.799444 }, 3800, 6700000, { landing: 10, passenger: 7.5 }],
    ['NBO', 'Nairobi', 'Kenya', 'KE', { latitude: -1.318611, longitude: 36.925833 }, 4200, 6600000, { landing: 10, passenger: 7.5 }],
    ['LOS', 'Lagos', 'Nigeria', 'NG', { latitude: 6.577222, longitude: 3.321111 }, 3900, 6600000, { landing: 10, passenger: 7.5 }],
    ['ALG', 'Algiers', 'Algeria', 'DZ', { latitude: 36.691014, longitude: 3.215408 }, 3500, 6300000, { landing: 10, passenger: 7.5 }],
    ['ABV', 'Abuja', 'Nigeria', 'NG', { latitude: 9.006667, longitude: 7.263056 }, 3610, 6000000, { landing: 10, passenger: 7.5 }],
    ['TUN', 'Tunis', 'Tunisia', 'TN', { latitude: 36.851111, longitude: 10.227222 }, 3200, 5500000, { landing: 10, passenger: 7.5 }],
    ['RAK', 'Marrakesh', 'Morocco', 'MA', { latitude: 31.606944, longitude: -8.036389 }, 3100, 4900000, { landing: 10, passenger: 7.5 }],
    ['DUR', 'Durban', 'South Africa', 'ZA', { latitude: -29.616667, longitude: 31.108333 }, 3700, 4200000, { landing: 10, passenger: 7.5 }],
    ['FNC', 'Funchal', 'Portugal', 'PT', { latitude: 32.694167, longitude: -16.778056 }, 2781, 4100000, { landing: 12.5, passenger: 42.5 }],
    ['DAR', 'Dar es Salaam', 'Tanzania', 'TZ', { latitude: -6.878056, longitude: 39.202778 }, 4600, 2500000, { landing: 10, passenger: 7.5 }],
    ['ACC', 'Accra', 'Ghana', 'GH', { latitude: 5.604667, longitude: -0.167389 }, 3403, 2800000, { landing: 10, passenger: 7.5 }],
    ['DKR', 'Dakar', 'Senegal', 'SN', { latitude: 14.739444, longitude: -17.49 }, 3490, 2200000, { landing: 10, passenger: 7.5 }],
    ['EBB', 'Kampala', 'Uganda', 'UG', { latitude: 0.044722, longitude: 32.443056 }, 3658, 1500000, { landing: 10, passenger: 7.5 }],
    ['BZV', 'Brazzaville', 'Congo', 'CG', { latitude: -4.251667, longitude: 15.253056 }, 3300, 1000000, { landing: 10, passenger: 7.5 }],
    ['TNR', 'Antananarivo', 'Madagascar', 'MG', { latitude: -18.796944, longitude: 47.478889 }, 3100, 800000, { landing: 10, passenger: 7.5 }],
    ['LUN', 'Lusaka', 'Zambia', 'ZM', { latitude: -15.331667, longitude: 28.434167 }, 3962, 1400000, { landing: 10, passenger: 7.5 }]
  ],
  OCEANIA: [
    ['SYD', 'Sydney', 'Australia', 'AU', { latitude: -33.946111, longitude: 151.177222 }, 3962, 44000000, { landing: 15, passenger: 25 }],
    ['MEL', 'Melbourne', 'Australia', 'AU', { latitude: -37.673333, longitude: 144.843333 }, 3658, 37000000, { landing: 15, passenger: 25 }],
    ['BNE', 'Brisbane', 'Australia', 'AU', { latitude: -27.384167, longitude: 153.1175 }, 3800, 23000000, { landing: 15, passenger: 25 }]
  ]
}

export const calculateAirportsDistance = (airport1: Airport, airport2: Airport): number => {
  return GreatCircle.calculateDistance(airport1.coordinates, airport2.coordinates)
}

export class Airport {
  constructor (
    public readonly region: keyof typeof Regions,
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
