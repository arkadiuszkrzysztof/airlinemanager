export const getRandomCharacters = (length: number, includeNumbers: boolean = false): string => {
  const characters = includeNumbers ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const formatTurnaround = (turnaround: number): string => {
  return `${Math.floor(turnaround / 60)}h ${Math.floor(turnaround % 60)}m`
}

export const formatCashValue = (value: number): string => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export const formatUtilization = (utilization: number): string => {
  return `${utilization}%`
}

export const formatPercentageValue = (value: number): string => {
  return `${Math.floor(value * 100)}%`
}
