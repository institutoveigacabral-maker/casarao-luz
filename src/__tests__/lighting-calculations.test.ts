import { describe, it, expect } from "vitest"

/**
 * Extracted from ProjectDetailClient.tsx — calculateSpaceMetrics logic
 */

type Product = {
  fluxLumens: number | null
  powerWatts: number | null
  priceBrl: number | null
  cri: number | null
}

type BOQItem = {
  quantity: number
  product: Product | null
}

type Space = {
  areaM2: number
  activityType: string
  boqItems: BOQItem[]
}

type ComplianceRule = {
  activityType: string
  minLux: number
  minCri: number
}

function calculateSpaceMetrics(space: Space, rules: ComplianceRule[]) {
  const totalLumens = space.boqItems.reduce(
    (sum, item) => sum + ((item.product?.fluxLumens || 0) * item.quantity),
    0
  )
  const totalWatts = space.boqItems.reduce(
    (sum, item) => sum + ((item.product?.powerWatts || 0) * item.quantity),
    0
  )
  const totalCost = space.boqItems.reduce(
    (sum, item) => sum + ((item.product?.priceBrl || 0) * item.quantity),
    0
  )
  const totalProducts = space.boqItems.reduce((sum, item) => sum + item.quantity, 0)

  const luxLevel = space.areaM2 > 0 ? totalLumens / space.areaM2 : 0
  const efficiency = totalWatts > 0 ? totalLumens / totalWatts : 0

  const rule = rules.find((r) => r.activityType === space.activityType)
  const luxCompliant = rule ? luxLevel >= rule.minLux : true
  const criValues = space.boqItems
    .filter((item) => item.product?.cri)
    .map((item) => item.product!.cri!)
  const avgCri = criValues.length > 0 ? criValues.reduce((a, b) => a + b, 0) / criValues.length : 0
  const criCompliant = rule ? avgCri >= rule.minCri : true

  return {
    totalLumens,
    totalWatts,
    totalCost,
    totalProducts,
    luxLevel,
    efficiency,
    luxCompliant,
    criCompliant,
    avgCri,
    rule,
  }
}

/**
 * Energy cost calculation from executive report:
 * (totalWatts / 1000) * 8 * 252 * 0.85
 * 8h/day, 252 working days, R$0.85/kWh
 */
function calculateAnnualEnergyCost(totalWatts: number): number {
  return (totalWatts / 1000) * 8 * 252 * 0.85
}

const defaultRules: ComplianceRule[] = [
  { activityType: "escritorio_open_plan", minLux: 500, minCri: 80 },
  { activityType: "sala_reuniao", minLux: 500, minCri: 80 },
  { activityType: "corredor", minLux: 100, minCri: 40 },
  { activityType: "estacionamento", minLux: 75, minCri: 40 },
  { activityType: "recepcao", minLux: 300, minCri: 80 },
]

describe("Lighting Calculations - calculateSpaceMetrics", () => {
  it("should calculate total lumens correctly", () => {
    const space: Space = {
      areaM2: 50,
      activityType: "escritorio_open_plan",
      boqItems: [
        { quantity: 10, product: { fluxLumens: 1100, powerWatts: 12, priceBrl: 69.9, cri: 90 } },
        { quantity: 5, product: { fluxLumens: 3600, powerWatts: 36, priceBrl: 289.9, cri: 90 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    expect(metrics.totalLumens).toBe(10 * 1100 + 5 * 3600) // 11000 + 18000 = 29000
    expect(metrics.totalLumens).toBe(29000)
  })

  it("should calculate lux level as lumens / area", () => {
    const space: Space = {
      areaM2: 100,
      activityType: "escritorio_open_plan",
      boqItems: [
        { quantity: 20, product: { fluxLumens: 3600, powerWatts: 36, priceBrl: 289.9, cri: 90 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    // 20 * 3600 = 72000 lumens / 100 m2 = 720 lux
    expect(metrics.luxLevel).toBe(720)
    expect(metrics.luxCompliant).toBe(true) // >= 500
  })

  it("should return 0 lux when area is 0", () => {
    const space: Space = {
      areaM2: 0,
      activityType: "escritorio_open_plan",
      boqItems: [
        { quantity: 5, product: { fluxLumens: 1000, powerWatts: 10, priceBrl: 50, cri: 80 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    expect(metrics.luxLevel).toBe(0)
  })

  it("should calculate total watts correctly", () => {
    const space: Space = {
      areaM2: 30,
      activityType: "corredor",
      boqItems: [
        { quantity: 4, product: { fluxLumens: 630, powerWatts: 7, priceBrl: 45.9, cri: 90 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    expect(metrics.totalWatts).toBe(28) // 4 * 7
  })

  it("should calculate luminous efficiency (lm/W)", () => {
    const space: Space = {
      areaM2: 20,
      activityType: "corredor",
      boqItems: [
        { quantity: 3, product: { fluxLumens: 1800, powerWatts: 18, priceBrl: 169.9, cri: 90 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    // efficiency = totalLumens / totalWatts = 5400 / 54 = 100 lm/W
    expect(metrics.efficiency).toBe(100)
  })

  it("should return 0 efficiency when totalWatts is 0", () => {
    const space: Space = {
      areaM2: 10,
      activityType: "corredor",
      boqItems: [
        { quantity: 2, product: { fluxLumens: 500, powerWatts: 0, priceBrl: 30, cri: 80 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    expect(metrics.efficiency).toBe(0)
  })

  it("should calculate total cost correctly", () => {
    const space: Space = {
      areaM2: 40,
      activityType: "sala_reuniao",
      boqItems: [
        { quantity: 3, product: { fluxLumens: 2200, powerWatts: 24, priceBrl: 399.9, cri: 90 } },
        { quantity: 2, product: { fluxLumens: 1000, powerWatts: 12, priceBrl: 189.9, cri: 80 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    const expected = 3 * 399.9 + 2 * 189.9
    expect(metrics.totalCost).toBeCloseTo(expected, 2)
  })

  it("should calculate total products count", () => {
    const space: Space = {
      areaM2: 50,
      activityType: "recepcao",
      boqItems: [
        { quantity: 8, product: { fluxLumens: 630, powerWatts: 7, priceBrl: 45.9, cri: 90 } },
        { quantity: 4, product: { fluxLumens: 1100, powerWatts: 12, priceBrl: 69.9, cri: 90 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    expect(metrics.totalProducts).toBe(12)
  })

  it("should calculate average CRI correctly", () => {
    const space: Space = {
      areaM2: 50,
      activityType: "escritorio_open_plan",
      boqItems: [
        { quantity: 5, product: { fluxLumens: 1000, powerWatts: 10, priceBrl: 50, cri: 90 } },
        { quantity: 5, product: { fluxLumens: 1000, powerWatts: 10, priceBrl: 50, cri: 80 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    // avgCri is average of CRI values per BOQ item (not weighted by quantity)
    expect(metrics.avgCri).toBe(85)
  })

  it("should handle null product values gracefully", () => {
    const space: Space = {
      areaM2: 20,
      activityType: "corredor",
      boqItems: [
        { quantity: 3, product: null },
        { quantity: 2, product: { fluxLumens: null, powerWatts: null, priceBrl: null, cri: null } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    expect(metrics.totalLumens).toBe(0)
    expect(metrics.totalWatts).toBe(0)
    expect(metrics.totalCost).toBe(0)
    expect(metrics.avgCri).toBe(0)
  })

  it("should handle empty boqItems", () => {
    const space: Space = {
      areaM2: 100,
      activityType: "escritorio_open_plan",
      boqItems: [],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    expect(metrics.totalLumens).toBe(0)
    expect(metrics.luxLevel).toBe(0)
    expect(metrics.totalProducts).toBe(0)
    // With 0 lux, should be non-compliant for 500 lux requirement
    expect(metrics.luxCompliant).toBe(false)
  })

  it("should mark non-compliant when lux is below minimum", () => {
    const space: Space = {
      areaM2: 100,
      activityType: "escritorio_open_plan",
      boqItems: [
        { quantity: 5, product: { fluxLumens: 630, powerWatts: 7, priceBrl: 45.9, cri: 90 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    // 5 * 630 = 3150 lumens / 100 m2 = 31.5 lux (far below 500)
    expect(metrics.luxLevel).toBe(31.5)
    expect(metrics.luxCompliant).toBe(false)
  })

  it("should be compliant for activity without a rule", () => {
    const space: Space = {
      areaM2: 50,
      activityType: "unknown_activity",
      boqItems: [
        { quantity: 1, product: { fluxLumens: 100, powerWatts: 5, priceBrl: 20, cri: 50 } },
      ],
    }
    const metrics = calculateSpaceMetrics(space, defaultRules)
    expect(metrics.luxCompliant).toBe(true)
    expect(metrics.criCompliant).toBe(true)
  })
})

describe("Annual Energy Cost Calculation", () => {
  it("should calculate annual energy cost with standard assumptions", () => {
    // 1000W = 1kW, 8h/day, 252 days, R$0.85/kWh
    const cost = calculateAnnualEnergyCost(1000)
    expect(cost).toBeCloseTo(1 * 8 * 252 * 0.85, 2)
    expect(cost).toBeCloseTo(1713.6, 2)
  })

  it("should return 0 cost for 0 watts", () => {
    expect(calculateAnnualEnergyCost(0)).toBe(0)
  })

  it("should scale linearly with wattage", () => {
    const cost100 = calculateAnnualEnergyCost(100)
    const cost200 = calculateAnnualEnergyCost(200)
    expect(cost200).toBeCloseTo(cost100 * 2, 2)
  })

  it("should calculate realistic office scenario", () => {
    // 50m2 office with 20 x 36W linear fixtures = 720W
    const cost = calculateAnnualEnergyCost(720)
    // 0.72kW * 8h * 252d * 0.85 = ~1233.79
    expect(cost).toBeCloseTo(1233.79, 0)
  })
})
