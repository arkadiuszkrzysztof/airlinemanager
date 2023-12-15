export enum Tier {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum'
}

export interface TierRecord {
  minReputation: number
  constraints: {
    MTOW: number
    maxPlanes: number
    reputationGain: number
    maxNumberOfRegions: number
    canFlyCrossRegion: boolean
    canOrderNewPlanes: boolean
  }
  perks: {
    hubDiscount: number
    destinationDiscount: number
    marketDiscount: number
  }
}

export const Tiers: Record<Tier, TierRecord> = {
  [Tier.PLATINUM]: {
    minReputation: 90,
    constraints: {
      MTOW: 600,
      maxPlanes: 25,
      reputationGain: 0.3,
      maxNumberOfRegions: 6,
      canFlyCrossRegion: true,
      canOrderNewPlanes: true
    },
    perks: {
      hubDiscount: 0.4,
      destinationDiscount: 0.2,
      marketDiscount: 0.2
    }
  },
  [Tier.GOLD]: {
    minReputation: 50,
    constraints: {
      MTOW: 350,
      maxPlanes: 15,
      reputationGain: 0.5,
      maxNumberOfRegions: 4,
      canFlyCrossRegion: true,
      canOrderNewPlanes: true
    },
    perks: {
      hubDiscount: 0.3,
      destinationDiscount: 0.1,
      marketDiscount: 0.1
    }
  },
  [Tier.SILVER]: {
    minReputation: 25,
    constraints: {
      MTOW: 250,
      maxPlanes: 10,
      reputationGain: 0.7,
      maxNumberOfRegions: 2,
      canFlyCrossRegion: false,
      canOrderNewPlanes: false
    },
    perks: {
      hubDiscount: 0.2,
      destinationDiscount: 0.1,
      marketDiscount: 0.05
    }
  },
  [Tier.BRONZE]: {
    minReputation: 0,
    constraints: {
      MTOW: 50,
      maxPlanes: 5,
      reputationGain: 1,
      maxNumberOfRegions: 1,
      canFlyCrossRegion: false,
      canOrderNewPlanes: false
    },
    perks: {
      hubDiscount: 0.1,
      destinationDiscount: 0.05,
      marketDiscount: 0
    }
  }
}
