export const getRandomCharacters = (length: number, includeNumbers: boolean = false): string => {
  const characters = includeNumbers ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const getDepreciation = (price: number, age: number): number => {
  for (let i = 1; i <= age; i++) {
    price *= (1 - (40 - i) / 500)
  }
  return price
}

export const formatTurnaround = (turnaround: number): string => {
  return `${Math.floor(turnaround / 60)}h ${Math.floor(turnaround % 60)}m`
}

export const formatCashValue = (value: number, showDecimal = false): string => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: (showDecimal ? 2 : 0), maximumFractionDigits: (showDecimal ? 2 : 0) })
}

export const formatUtilization = (utilization: number): string => {
  return `${utilization}%`
}

export const formatPercentageValue = (value: number): string => {
  return `${Math.floor(value * 100)}%`
}

export const formatScale = (value: number, showDecimal: boolean = false): string => {
  if (value >= 1000000 && Math.floor(value / 1000000) < 10 && showDecimal) {
    return `${(Math.floor(value / 100000) / 10).toFixed(1)}M`
  } else if (value >= 1000000) {
    return `${Math.floor(value / 1000000)}M`
  } else if (value >= 1000 && Math.floor(value / 1000) < 10 && showDecimal) {
    return `${(Math.floor(value / 100) / 10).toFixed(1)}K`
  } else if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`
  } else {
    return `${Math.floor(value)}`
  }
}
