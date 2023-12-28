import { GreatCircle, type Coordinates } from '../controllers/helpers/GreatCircle'

export enum Regions {
  NA = 'North America',
  EU = 'Europe',
  ASIA = 'Asia',
  LATAM = 'Latin America',
  AFRICA = 'Africa',
  OCEANIA = 'Oceania'
}

export const RegionsKeys = [
  'NA' as keyof typeof Regions,
  'EU' as keyof typeof Regions,
  'ASIA' as keyof typeof Regions,
  'LATAM' as keyof typeof Regions,
  'AFRICA' as keyof typeof Regions,
  'OCEANIA' as keyof typeof Regions
]

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

const Fees = {
  SUPERHIGH: { landing: 15, passenger: 35 },
  HIGH: { landing: 15, passenger: 25 },
  MEDIUM: { landing: 10, passenger: 7.5 },
  LOW: { landing: 5, passenger: 5 }
}

export const AirportsData: Record<keyof typeof Regions, AirportTuple[]> = {
  NA: [
    ['ATL', 'Atlanta', 'United States', 'US', { latitude: 33.636667, longitude: -84.428056 }, 3776, 110500000, Fees.HIGH],
    ['LAX', 'Los Angeles', 'United States', 'US', { latitude: 33.9425, longitude: -118.408056 }, 3939, 88000000, Fees.SUPERHIGH],
    ['ORD', 'Chicago', 'United States', 'US', { latitude: 41.978611, longitude: -87.904722 }, 3962, 88000000, Fees.HIGH],
    ['DFW', 'Dallas', 'United States', 'US', { latitude: 32.896944, longitude: -97.038056 }, 4085, 75000000, Fees.HIGH],
    ['DEN', 'Denver', 'United States', 'US', { latitude: 39.861667, longitude: -104.673056 }, 4877, 69000000, Fees.HIGH],
    ['JFK', 'New York', 'United States', 'US', { latitude: 40.639722, longitude: -73.778889 }, 4423, 62500000, Fees.SUPERHIGH],
    ['SFO', 'San Francisco', 'United States', 'US', { latitude: 37.618889, longitude: -122.375 }, 3618, 57500000, Fees.SUPERHIGH],
    ['SEA', 'Seattle', 'United States', 'US', { latitude: 47.448889, longitude: -122.309444 }, 3627, 51800000, Fees.HIGH],
    ['LAS', 'Las Vegas', 'United States', 'US', { latitude: 36.08, longitude: -115.152222 }, 4424, 51700000, Fees.HIGH],
    ['MCO', 'Orlando', 'United States', 'US', { latitude: 28.429444, longitude: -81.308889 }, 3659, 50600000, Fees.HIGH],
    ['YVR', 'Vancouver', 'Canada', 'CA', { latitude: 49.194722, longitude: -123.183889 }, 3293, 26400000, Fees.MEDIUM],
    ['CUN', 'Cancun', 'Mexico', 'MX', { latitude: 21.036667, longitude: -86.876944 }, 3500, 25500000, Fees.MEDIUM],
    ['YUL', 'Montreal', 'Canada', 'CA', { latitude: 45.470556, longitude: -73.740833 }, 3353, 20300000, Fees.MEDIUM],
    ['YYZ', 'Toronto', 'Canada', 'CA', { latitude: 43.676667, longitude: -79.630556 }, 3389, 50500000, Fees.HIGH],
    ['MEX', 'Mexico City', 'Mexico', 'MX', { latitude: 19.436111, longitude: -99.071944 }, 3952, 50300000, Fees.MEDIUM],
    ['YYC', 'Calgary', 'Canada', 'CA', { latitude: 51.1225, longitude: -114.013333 }, 4267, 18000000, Fees.MEDIUM],
    ['GDL', 'Guadalajara', 'Mexico', 'MX', { latitude: 20.521667, longitude: -103.311111 }, 4000, 14800000, Fees.MEDIUM],
    ['HNL', 'Honolulu', 'United States', 'US', { latitude: 21.318611, longitude: -157.9225 }, 3753, 21700000, Fees.HIGH],
    ['NAS', 'Nassau', 'Bahamas', 'BS', { latitude: 25.038889, longitude: -77.466111 }, 3358, 4100000, Fees.HIGH],
    ['ABQ', 'Albuquerque', 'United States', 'US', { latitude: 35.039333, longitude: -106.610778 }, 4204, 5500000, Fees.MEDIUM],
    ['MSP', 'Minneapolis', 'United States', 'US', { latitude: 44.881944, longitude: -93.221667 }, 3355, 39500000, Fees.HIGH],
    ['SLC', 'Salt Lake City', 'United States', 'US', { latitude: 40.788333, longitude: -111.977778 }, 3658, 26800000, Fees.HIGH],
    ['IND', 'Indianapolis', 'United States', 'US', { latitude: 39.717222, longitude: -86.294444 }, 3414, 9500000, Fees.MEDIUM],
    ['MCI', 'Kansas City', 'United States', 'US', { latitude: 39.2975, longitude: -94.713889 }, 3292, 11800000, Fees.MEDIUM]
  ],
  EU: [
    ['KRK', 'Krakow', 'Poland', 'PL', { latitude: 50.077778, longitude: 19.784722 }, 2550, 7400000, Fees.MEDIUM],
    ['WAW', 'Warsaw', 'Poland', 'PL', { latitude: 52.165833, longitude: 20.967222 }, 3690, 14400000, Fees.MEDIUM],
    ['LHR', 'London', 'United Kingdom', 'UK', { latitude: 51.470833, longitude: -0.460556 }, 3902, 61600000, Fees.SUPERHIGH],
    ['AMS', 'Amsterdam', 'Netherlands', 'NL', { latitude: 52.308611, longitude: 4.763889 }, 3800, 52500000, Fees.SUPERHIGH],
    ['CDG', 'Paris', 'France', 'FR', { latitude: 49.009722, longitude: 2.547778 }, 4200, 57500000, Fees.SUPERHIGH],
    ['EDI', 'Edinburgh', 'United Kingdom', 'UK', { latitude: 55.95, longitude: -3.3725 }, 2556, 11250000, Fees.HIGH],
    ['IST', 'Istanbul', 'Turkey', 'TR', { latitude: 41.262222, longitude: 28.727778 }, 4100, 64500000, Fees.HIGH],
    ['KEF', 'Reykjavik', 'Iceland', 'IS', { latitude: 63.985, longitude: -22.605556 }, 3060, 6100000, Fees.MEDIUM],
    ['ARN', 'Stockholm', 'Sweden', 'SE', { latitude: 59.651944, longitude: 17.918611 }, 3301, 18400000, Fees.HIGH],
    ['SVO', 'Moscow', 'Russia', 'RU', { latitude: 55.972778, longitude: 37.414722 }, 3700, 28400000, Fees.MEDIUM],
    ['MAD', 'Madrid', 'Spain', 'ES', { latitude: 40.472222, longitude: -3.560833 }, 4350, 50600000, Fees.HIGH],
    ['LIS', 'Lisbon', 'Portugal', 'PT', { latitude: 38.774167, longitude: -9.134167 }, 3705, 28300000, Fees.MEDIUM],
    ['FRA', 'Frankfurt', 'Germany', 'DE', { latitude: 50.033333, longitude: 8.570556 }, 4000, 49000000, Fees.HIGH],
    ['FCO', 'Rome', 'Italy', 'IT', { latitude: 41.800278, longitude: 12.238889 }, 3900, 29000000, Fees.HIGH],
    ['PMI', 'Palma', 'Spain', 'ES', { latitude: 39.551667, longitude: 2.738889 }, 3270, 28500000, Fees.MEDIUM],
    ['DUB', 'Dublin', 'Ireland', 'IE', { latitude: 53.421389, longitude: -6.270833 }, 3110, 27800000, Fees.HIGH],
    ['ATH', 'Athens', 'Greece', 'GR', { latitude: 37.936389, longitude: 23.947222 }, 4000, 22700000, Fees.MEDIUM],
    ['BER', 'Berlin', 'Germany', 'DE', { latitude: 52.366667, longitude: 13.503333 }, 4000, 19800000, Fees.SUPERHIGH],
    ['HEL', 'Helsinki', 'Finland', 'FI', { latitude: 60.317222, longitude: 24.963333 }, 3500, 12900000, Fees.MEDIUM],
    ['OSL', 'Oslo', 'Norway', 'NO', { latitude: 60.202778, longitude: 11.083889 }, 3600, 22500000, Fees.HIGH],
    ['MXP', 'Milan', 'Italy', 'IT', { latitude: 45.63, longitude: 8.723056 }, 3920, 9600000, Fees.HIGH],
    ['OTP', 'Bucharest', 'Romania', 'RO', { latitude: 44.571111, longitude: 26.085 }, 3500, 6900000, Fees.MEDIUM],
    ['KBP', 'Kiev', 'Ukraine', 'UA', { latitude: 50.344722, longitude: 30.893333 }, 4000, 15300000, Fees.MEDIUM],
    ['VNO', 'Vilnius', 'Lithuania', 'LT', { latitude: 54.636944, longitude: 25.287778 }, 2515, 4900000, Fees.MEDIUM]
  ],
  ASIA: [
    ['PEK', 'Beijing', 'China', 'CN', { latitude: 40.0725, longitude: 116.5975 }, 3810, 101000000, Fees.HIGH],
    ['DXB', 'Dubai', 'United Arab Emirates', 'AE', { latitude: 25.252778, longitude: 55.364444 }, 4447, 89000000, Fees.SUPERHIGH],
    ['HND', 'Tokyo', 'Japan', 'JP', { latitude: 35.553333, longitude: 139.781111 }, 3360, 87100000, Fees.SUPERHIGH],
    ['HKG', 'Hong Kong', 'Hong Kong', 'HK', { latitude: 22.308889, longitude: 113.914444 }, 3800, 74500000, Fees.HIGH],
    ['PVG', 'Shanghai', 'China', 'CN', { latitude: 31.143333, longitude: 121.805278 }, 4000, 74000000, Fees.HIGH],
    ['DEL', 'Delhi', 'India', 'IN', { latitude: 28.568611, longitude: 77.112222 }, 4430, 69900000, Fees.MEDIUM],
    ['CAN', 'Guangzhou', 'China', 'CN', { latitude: 23.3925, longitude: 113.298889 }, 3800, 69700000, Fees.HIGH],
    ['ICN', 'Seoul', 'South Korea', 'KR', { latitude: 37.463333, longitude: 126.44 }, 4000, 68300000, Fees.SUPERHIGH],
    ['BKK', 'Bangkok', 'Thailand', 'TH', { latitude: 13.6925, longitude: 100.75 }, 4000, 63400000, Fees.HIGH],
    ['BOM', 'Mumbai', 'India', 'IN', { latitude: 19.088611, longitude: 72.868056 }, 3660, 49900000, Fees.MEDIUM],
    ['TPE', 'Taipei', 'Taiwan', 'TW', { latitude: 25.076389, longitude: 121.223889 }, 3800, 46500000, Fees.HIGH],
    ['SHA', 'Shanghai', 'China', 'CN', { latitude: 31.198056, longitude: 121.336389 }, 3400, 43600000, Fees.HIGH],
    ['JED', 'Jeddah', 'Saudi Arabia', 'SA', { latitude: 21.679444, longitude: 39.156667 }, 4000, 41200000, Fees.SUPERHIGH],
    ['DOH', 'Doha', 'Qatar', 'QA', { latitude: 25.273056, longitude: 51.608056 }, 4850, 35400000, Fees.SUPERHIGH],
    ['BLR', 'Bangalore', 'India', 'IN', { latitude: 13.206944, longitude: 77.704167 }, 4000, 33300000, Fees.MEDIUM],
    ['KIX', 'Osaka', 'Japan', 'JP', { latitude: 34.430556, longitude: 135.230278 }, 4000, 28700000, Fees.HIGH],
    ['AYT', 'Antalya', 'Turkey', 'TR', { latitude: 36.900278, longitude: 30.792778 }, 3400, 28600000, Fees.MEDIUM],
    ['HAN', 'Hanoi', 'Vietnam', 'VN', { latitude: 21.213889, longitude: 105.803056 }, 3800, 27000000, Fees.MEDIUM],
    ['TLV', 'Tel Aviv', 'Israel', 'IL', { latitude: 32.009444, longitude: 34.882778 }, 4062, 23000000, Fees.HIGH],
    ['IKA', 'Tehran', 'Iran', 'IR', { latitude: 35.416111, longitude: 51.152222 }, 4249, 8900000, Fees.MEDIUM],
    ['ASB', 'Ashgabat', 'Turkmenistan', 'TM', { latitude: 37.986944, longitude: 58.360833 }, 3800, 1300000, Fees.LOW],
    ['NQZ', 'Astana', 'Kazakhstan', 'KZ', { latitude: 51.021944, longitude: 71.466944 }, 3500, 6000000, Fees.MEDIUM],
    ['OVB', 'Novosibirsk', 'Russia', 'RU', { latitude: 55.0125, longitude: 82.650556 }, 3600, 6800000, Fees.MEDIUM],
    ['ULN', 'Ulaanbaatar', 'Mongolia', 'MN', { latitude: 47.843056, longitude: 106.766389 }, 3100, 1600000, Fees.LOW]
  ],
  LATAM: [
    ['PTY', 'Panama City', 'Panama', 'PA', { latitude: 9.071389, longitude: -79.383611 }, 3050, 16600000, Fees.MEDIUM],
    ['SJO', 'San Jose', 'Costa Rica', 'CR', { latitude: 9.993889, longitude: -84.208889 }, 3012, 5000000, Fees.MEDIUM],
    ['SAL', 'San Salvador', 'El Salvador', 'SV', { latitude: 13.440833, longitude: -89.055556 }, 3200, 3400000, Fees.LOW],
    ['GUA', 'Guatemala City', 'Guatemala', 'GT', { latitude: 14.581667, longitude: -90.526667 }, 2987, 2800000, Fees.LOW],
    ['BZE', 'Belize City', 'Belize', 'BZ', { latitude: 17.539167, longitude: -88.308333 }, 2950, 1100000, Fees.LOW],
    ['HAV', 'Havana', 'Cuba', 'CU', { latitude: 22.989167, longitude: -82.409167 }, 4000, 9700000, Fees.MEDIUM],
    ['PUJ', 'Punta Cana', 'Dominican Republic', 'DO', { latitude: 18.566667, longitude: -68.351944 }, 3100, 8400000, Fees.MEDIUM],
    ['SJU', 'San Juan', 'Puerto Rico', 'PR', { latitude: 18.439167, longitude: -66.001944 }, 3170, 10800000, Fees.MEDIUM],
    ['MBJ', 'Montego Bay', 'Jamaica', 'JM', { latitude: 18.503611, longitude: -77.913333 }, 3060, 4400000, Fees.LOW],
    ['BOG', 'Bogota', 'Colombia', 'CO', { latitude: 4.701389, longitude: -74.146944 }, 3800, 36500000, Fees.HIGH],
    ['GRU', 'Sao Paulo', 'Brazil', 'BR', { latitude: -23.435556, longitude: -46.473056 }, 3700, 43000000, Fees.HIGH],
    ['LIM', 'Lima', 'Peru', 'PE', { latitude: -12.021944, longitude: -77.114444 }, 3507, 22000000, Fees.MEDIUM],
    ['SCL', 'Santiago', 'Chile', 'CL', { latitude: -33.392778, longitude: -70.785556 }, 3800, 20400000, Fees.MEDIUM],
    ['CGH', 'Sao Paulo', 'Brazil', 'BR', { latitude: -23.626111, longitude: -46.656389 }, 1940, 18100000, Fees.MEDIUM],
    ['BSB', 'Brasilia', 'Brazil', 'BR', { latitude: -15.871111, longitude: -47.918611 }, 3300, 16000000, Fees.MEDIUM],
    ['MDE', 'Medellin', 'Colombia', 'CO', { latitude: 6.167222, longitude: -75.426667 }, 3557, 13500000, Fees.MEDIUM],
    ['AEP', 'Buenos Aires', 'Argentina', 'AR', { latitude: -34.558889, longitude: -58.416389 }, 2700, 13000000, Fees.MEDIUM],
    ['VCP', 'Campinas', 'Brazil', 'BR', { latitude: -23.006944, longitude: -47.134444 }, 3240, 11800000, Fees.MEDIUM],
    ['SDU', 'Rio de Janeiro', 'Brazil', 'BR', { latitude: -22.91, longitude: -43.1625 }, 1323, 10200000, Fees.MEDIUM],
    ['CCS', 'Caracas', 'Venezuela', 'VE', { latitude: 10.603056, longitude: -66.990556 }, 3610, 12000000, Fees.MEDIUM],
    ['BEL', 'Belem', 'Brazil', 'BR', { latitude: -1.384722, longitude: -48.478889 }, 2800, 3400000, Fees.LOW],
    ['ASU', 'Asuncion', 'Paraguay', 'PY', { latitude: -25.239722, longitude: -57.519167 }, 3353, 1200000, Fees.LOW],
    ['VVI', 'Santa Cruz', 'Bolivia', 'BO', { latitude: -17.644722, longitude: -63.135278 }, 3500, 2500000, Fees.LOW],
    ['PUQ', 'Punta Arenas', 'Chile', 'CL', { latitude: -53.0025, longitude: -70.854444 }, 2790, 1300000, Fees.LOW]
  ],
  AFRICA: [
    ['CAI', 'Cairo', 'Egypt', 'EG', { latitude: 30.121944, longitude: 31.405556 }, 4000, 20000000, Fees.HIGH],
    ['JNB', 'Johannesburg', 'South Africa', 'ZA', { latitude: -26.133333, longitude: 28.25 }, 4421, 14800000, Fees.MEDIUM],
    ['LPA', 'Las Palmas', 'Spain', 'ES', { latitude: 27.931944, longitude: -15.386667 }, 3100, 12400000, Fees.HIGH],
    ['TFS', 'Tenerife', 'Spain', 'ES', { latitude: 28.044444, longitude: -16.5725 }, 3200, 10800000, Fees.HIGH],
    ['CPT', 'Cape Town', 'South Africa', 'ZA', { latitude: -33.969444, longitude: 18.597222 }, 3201, 7900000, Fees.MEDIUM],
    ['CMN', 'Casablanca', 'Morocco', 'MA', { latitude: 33.367222, longitude: -7.589722 }, 3720, 7600000, Fees.MEDIUM],
    ['ACE', 'Lanzarote', 'Spain', 'ES', { latitude: 28.945556, longitude: -13.605278 }, 2400, 7400000, Fees.MEDIUM],
    ['HRG', 'Hurghada', 'Egypt', 'EG', { latitude: 27.178056, longitude: 33.799167 }, 4000, 7200000, Fees.MEDIUM],
    ['ADD', 'Addis Ababa', 'Ethiopia', 'ET', { latitude: 8.977778, longitude: 38.799444 }, 3800, 6700000, Fees.MEDIUM],
    ['NBO', 'Nairobi', 'Kenya', 'KE', { latitude: -1.318611, longitude: 36.925833 }, 4200, 6600000, Fees.MEDIUM],
    ['LOS', 'Lagos', 'Nigeria', 'NG', { latitude: 6.577222, longitude: 3.321111 }, 3900, 6600000, Fees.MEDIUM],
    ['ALG', 'Algiers', 'Algeria', 'DZ', { latitude: 36.691014, longitude: 3.215408 }, 3500, 6300000, Fees.LOW],
    ['ABV', 'Abuja', 'Nigeria', 'NG', { latitude: 9.006667, longitude: 7.263056 }, 3610, 6000000, Fees.LOW],
    ['TUN', 'Tunis', 'Tunisia', 'TN', { latitude: 36.851111, longitude: 10.227222 }, 3200, 5500000, Fees.LOW],
    ['RAK', 'Marrakesh', 'Morocco', 'MA', { latitude: 31.606944, longitude: -8.036389 }, 3100, 4900000, Fees.LOW],
    ['DUR', 'Durban', 'South Africa', 'ZA', { latitude: -29.616667, longitude: 31.108333 }, 3700, 4200000, Fees.LOW],
    ['FNC', 'Funchal', 'Portugal', 'PT', { latitude: 32.694167, longitude: -16.778056 }, 2781, 4100000, Fees.LOW],
    ['DAR', 'Dar es Salaam', 'Tanzania', 'TZ', { latitude: -6.878056, longitude: 39.202778 }, 4600, 2500000, Fees.LOW],
    ['ACC', 'Accra', 'Ghana', 'GH', { latitude: 5.604667, longitude: -0.167389 }, 3403, 2800000, Fees.LOW],
    ['DKR', 'Dakar', 'Senegal', 'SN', { latitude: 14.739444, longitude: -17.49 }, 3490, 2200000, Fees.LOW],
    ['EBB', 'Kampala', 'Uganda', 'UG', { latitude: 0.044722, longitude: 32.443056 }, 3658, 1500000, Fees.LOW],
    ['BZV', 'Brazzaville', 'Congo', 'CG', { latitude: -4.251667, longitude: 15.253056 }, 3300, 1000000, Fees.LOW],
    ['TNR', 'Antananarivo', 'Madagascar', 'MG', { latitude: -18.796944, longitude: 47.478889 }, 3100, 800000, Fees.LOW],
    ['LUN', 'Lusaka', 'Zambia', 'ZM', { latitude: -15.331667, longitude: 28.434167 }, 3962, 1400000, Fees.LOW]
  ],
  OCEANIA: [
    ['SYD', 'Sydney', 'Australia', 'AU', { latitude: -33.946111, longitude: 151.177222 }, 3962, 44400000, Fees.SUPERHIGH],
    ['MEL', 'Melbourne', 'Australia', 'AU', { latitude: -37.673333, longitude: 144.843333 }, 3657, 37000000, Fees.HIGH],
    ['BNE', 'Brisbane', 'Australia', 'AU', { latitude: -27.383333, longitude: 153.118333 }, 3560, 23600000, Fees.HIGH],
    ['PER', 'Perth', 'Australia', 'AU', { latitude: -31.94, longitude: 115.965 }, 3444, 12400000, Fees.HIGH],
    ['ADL', 'Adelaide', 'Australia', 'AU', { latitude: -34.945, longitude: 138.530556 }, 3100, 8400000, Fees.MEDIUM],
    ['ASP', 'Alice Springs', 'Australia', 'AU', { latitude: -23.806944, longitude: 133.902222 }, 2438, 620000, Fees.LOW],
    ['DRW', 'Darwin', 'Australia', 'AU', { latitude: -12.414722, longitude: 130.876667 }, 3354, 1900000, Fees.MEDIUM],
    ['PHE', 'Port Hedland', 'Australia', 'AU', { latitude: -20.377778, longitude: 118.626389 }, 2500, 510000, Fees.LOW],
    ['AKL', 'Auckland', 'New Zealand', 'NZ', { latitude: -37.008056, longitude: 174.791667 }, 3535, 20500000, Fees.MEDIUM],
    ['CHC', 'Christchurch', 'New Zealand', 'NZ', { latitude: -43.489444, longitude: 172.532222 }, 3288, 6900000, Fees.MEDIUM],
    ['WLG', 'Wellington', 'New Zealand', 'NZ', { latitude: -41.327222, longitude: 174.805278 }, 2081, 6200000, Fees.MEDIUM],
    ['POM', 'Port Moresby', 'Papua New Guinea', 'PG', { latitude: -9.443333, longitude: 147.22 }, 2750, 1400000, Fees.LOW],
    ['CGK', 'Jakarta', 'Indonesia', 'ID', { latitude: -6.125556, longitude: 106.655833 }, 3660, 65900000, Fees.HIGH],
    ['DPS', 'Denpasar', 'Indonesia', 'ID', { latitude: -8.748056, longitude: 115.1675 }, 3000, 23800000, Fees.HIGH],
    ['SUB', 'Surabaya', 'Indonesia', 'ID', { latitude: -7.379722, longitude: 112.786944 }, 3000, 21000000, Fees.MEDIUM],
    ['UPG', 'Makassar', 'Indonesia', 'ID', { latitude: -5.061667, longitude: 119.554167 }, 3500, 13500000, Fees.MEDIUM],
    ['KNO', 'Kupang', 'Indonesia', 'ID', { latitude: 3.642222, longitude: 98.885278 }, 3750, 10000000, Fees.MEDIUM],
    ['KUL', 'Kuala Lumpur', 'Malaysia', 'MY', { latitude: 2.743333, longitude: 101.698056 }, 4124, 62300000, Fees.HIGH],
    ['BKI', 'Kota Kinabalu', 'Malaysia', 'MY', { latitude: 5.944722, longitude: 116.058611 }, 3780, 9400000, Fees.MEDIUM],
    ['KCH', 'Kuching', 'Malaysia', 'MY', { latitude: 1.487083, longitude: 110.341917 }, 3780, 5900000, Fees.MEDIUM],
    ['MNL', 'Manila', 'Philippines', 'PH', { latitude: 14.508333, longitude: 121.019722 }, 3737, 47900000, Fees.HIGH],
    ['CEB', 'Cebu', 'Philippines', 'PH', { latitude: 10.307222, longitude: 123.978889 }, 3300, 12700000, Fees.MEDIUM],
    ['SIN', 'Singapore', 'Singapore', 'SG', { latitude: 1.359167, longitude: 103.989444 }, 4000, 68300000, Fees.SUPERHIGH],
    ['NAN', 'Nadi', 'Fiji', 'FJ', { latitude: -17.755278, longitude: 177.443333 }, 3206, 2500000, Fees.LOW]
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
