import { describe, it, expect } from "vitest"

/**
 * Tests for project-level metric aggregation from ProjectDetailClient.tsx
 * (executive report calculations).
 */

type SpaceMetrics = {
  totalCost: number
  totalWatts: number
  totalProducts: number
  luxCompliant: boolean
  criCompliant: boolean
}

function aggregateProjectMetrics(spaceMetrics: SpaceMetrics[]) {
  const totalCost = spaceMetrics.reduce((sum, m) => sum + m.totalCost, 0)
  const totalWatts = spaceMetrics.reduce((sum, m) => sum + m.totalWatts, 0)
  const totalProducts = spaceMetrics.reduce((sum, m) => sum + m.totalProducts, 0)
  const compliantSpaces = spaceMetrics.filter(
    (m) => m.luxCompliant && m.criCompliant
  ).length
  const totalSpaces = spaceMetrics.length
  const compliancePercentage =
    totalSpaces > 0 ? Math.round((compliantSpaces / totalSpaces) * 100) : 0
  const totalKw = totalWatts / 1000
  const annualEnergyCost = totalKw * 8 * 252 * 0.85

  return {
    totalCost,
    totalWatts,
    totalKw,
    totalProducts,
    compliantSpaces,
    totalSpaces,
    compliancePercentage,
    annualEnergyCost,
  }
}

describe("Project Metrics Aggregation", () => {
  const sampleMetrics: SpaceMetrics[] = [
    { totalCost: 2000, totalWatts: 360, totalProducts: 10, luxCompliant: true, criCompliant: true },
    { totalCost: 1500, totalWatts: 180, totalProducts: 5, luxCompliant: true, criCompliant: false },
    { totalCost: 800, totalWatts: 72, totalProducts: 4, luxCompliant: false, criCompliant: true },
  ]

  it("should sum total cost across all spaces", () => {
    const result = aggregateProjectMetrics(sampleMetrics)
    expect(result.totalCost).toBe(4300)
  })

  it("should sum total watts across all spaces", () => {
    const result = aggregateProjectMetrics(sampleMetrics)
    expect(result.totalWatts).toBe(612)
  })

  it("should convert watts to kilowatts", () => {
    const result = aggregateProjectMetrics(sampleMetrics)
    expect(result.totalKw).toBeCloseTo(0.612, 3)
  })

  it("should sum total products across all spaces", () => {
    const result = aggregateProjectMetrics(sampleMetrics)
    expect(result.totalProducts).toBe(19)
  })

  it("should count compliant spaces (both lux AND CRI must pass)", () => {
    const result = aggregateProjectMetrics(sampleMetrics)
    // Only first space is fully compliant
    expect(result.compliantSpaces).toBe(1)
  })

  it("should calculate compliance percentage", () => {
    const result = aggregateProjectMetrics(sampleMetrics)
    expect(result.compliancePercentage).toBe(33) // 1/3 = 33%
  })

  it("should calculate annual energy cost", () => {
    const result = aggregateProjectMetrics(sampleMetrics)
    // 0.612 kW * 8h * 252d * 0.85 R$/kWh
    const expected = 0.612 * 8 * 252 * 0.85
    expect(result.annualEnergyCost).toBeCloseTo(expected, 2)
  })

  it("should handle empty spaces", () => {
    const result = aggregateProjectMetrics([])
    expect(result.totalCost).toBe(0)
    expect(result.totalWatts).toBe(0)
    expect(result.compliantSpaces).toBe(0)
    expect(result.compliancePercentage).toBe(0)
  })

  it("should report 100% when all spaces are compliant", () => {
    const allCompliant: SpaceMetrics[] = [
      { totalCost: 1000, totalWatts: 100, totalProducts: 5, luxCompliant: true, criCompliant: true },
      { totalCost: 2000, totalWatts: 200, totalProducts: 8, luxCompliant: true, criCompliant: true },
    ]
    const result = aggregateProjectMetrics(allCompliant)
    expect(result.compliancePercentage).toBe(100)
  })

  it("should report 0% when no spaces are compliant", () => {
    const noneCompliant: SpaceMetrics[] = [
      { totalCost: 500, totalWatts: 50, totalProducts: 2, luxCompliant: false, criCompliant: false },
      { totalCost: 300, totalWatts: 30, totalProducts: 1, luxCompliant: false, criCompliant: true },
    ]
    const result = aggregateProjectMetrics(noneCompliant)
    expect(result.compliancePercentage).toBe(0)
  })
})
