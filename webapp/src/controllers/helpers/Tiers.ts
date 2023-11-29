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
      MTOW: 750,
      maxPlanes: 25,
      reputationGain: 0.2
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
      MTOW: 500,
      maxPlanes: 15,
      reputationGain: 0.4
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
      MTOW: 300,
      maxPlanes: 10,
      reputationGain: 0.7
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
      reputationGain: 1
    },
    perks: {
      hubDiscount: 0.1,
      destinationDiscount: 0.05,
      marketDiscount: 0
    }
  }
}
