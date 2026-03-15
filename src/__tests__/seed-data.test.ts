import { describe, it, expect } from "vitest"

/**
 * Tests that validate the seed data integrity and NBR 8995-1 compliance rules.
 */

const COMPLIANCE_SEED = [
  { activityType: "escritorio_open_plan", minLux: 500, minCri: 80 },
  { activityType: "sala_reuniao", minLux: 500, minCri: 80 },
  { activityType: "corredor", minLux: 100, minCri: 40 },
  { activityType: "lobby", minLux: 200, minCri: 80 },
  { activityType: "recepcao", minLux: 300, minCri: 80 },
  { activityType: "copa", minLux: 200, minCri: 80 },
  { activityType: "banheiro", minLux: 200, minCri: 80 },
  { activityType: "sala_diretoria", minLux: 500, minCri: 80 },
  { activityType: "auditorio", minLux: 300, minCri: 80 },
  { activityType: "estacionamento", minLux: 75, minCri: 40 },
]

const PRODUCT_SEED = [
  { sku: "CL-SP-001", category: "spots", powerWatts: 7, fluxLumens: 630, cri: 90, priceBrl: 45.90 },
  { sku: "CL-SP-002", category: "spots", powerWatts: 12, fluxLumens: 1100, cri: 90, priceBrl: 69.90 },
  { sku: "CL-SP-003", category: "spots", powerWatts: 18, fluxLumens: 1800, cri: 95, priceBrl: 129.90 },
  { sku: "CL-SP-004", category: "spots", powerWatts: 5, fluxLumens: 450, cri: 92, priceBrl: 35.90 },
  { sku: "CL-LN-001", category: "linear", powerWatts: 36, fluxLumens: 3600, cri: 90, priceBrl: 289.90 },
  { sku: "CL-LN-002", category: "linear", powerWatts: 18, fluxLumens: 1800, cri: 90, priceBrl: 169.90 },
  { sku: "CL-LN-003", category: "linear", powerWatts: 72, fluxLumens: 7200, cri: 92, priceBrl: 549.90 },
  { sku: "CL-PD-001", category: "pendentes", powerWatts: 24, fluxLumens: 2200, cri: 90, priceBrl: 399.90 },
  { sku: "CL-PD-002", category: "pendentes", powerWatts: 15, fluxLumens: 1400, cri: 92, priceBrl: 259.90 },
  { sku: "CL-AR-001", category: "arandelas", powerWatts: 12, fluxLumens: 1000, cri: 80, priceBrl: 189.90 },
  { sku: "CL-AR-002", category: "arandelas", powerWatts: 10, fluxLumens: 900, cri: 85, priceBrl: 149.90 },
  { sku: "CL-PL-001", category: "plafons", powerWatts: 18, fluxLumens: 1600, cri: 80, priceBrl: 79.90 },
  { sku: "CL-PL-002", category: "plafons", powerWatts: 24, fluxLumens: 2200, cri: 85, priceBrl: 99.90 },
  { sku: "CL-EM-001", category: "embutidos", powerWatts: 15, fluxLumens: 1350, cri: 90, priceBrl: 89.90 },
  { sku: "CL-EM-002", category: "embutidos", powerWatts: 20, fluxLumens: 1900, cri: 92, priceBrl: 119.90 },
  { sku: "CL-EM-003", category: "embutidos", powerWatts: 10, fluxLumens: 900, cri: 85, priceBrl: 59.90 },
]

describe("Seed Data - Compliance Rules", () => {
  it("should have 10 compliance rules covering all activity types", () => {
    expect(COMPLIANCE_SEED).toHaveLength(10)
  })

  it("should have unique activity types", () => {
    const types = COMPLIANCE_SEED.map((r) => r.activityType)
    expect(new Set(types).size).toBe(types.length)
  })

  it("all minLux values should be positive", () => {
    COMPLIANCE_SEED.forEach((r) => {
      expect(r.minLux).toBeGreaterThan(0)
    })
  })

  it("all minCri values should be between 20 and 100", () => {
    COMPLIANCE_SEED.forEach((r) => {
      expect(r.minCri).toBeGreaterThanOrEqual(20)
      expect(r.minCri).toBeLessThanOrEqual(100)
    })
  })

  it("office-type spaces should require higher lux than utility spaces", () => {
    const office = COMPLIANCE_SEED.find((r) => r.activityType === "escritorio_open_plan")!
    const corredor = COMPLIANCE_SEED.find((r) => r.activityType === "corredor")!
    const estacionamento = COMPLIANCE_SEED.find((r) => r.activityType === "estacionamento")!

    expect(office.minLux).toBeGreaterThan(corredor.minLux)
    expect(office.minLux).toBeGreaterThan(estacionamento.minLux)
  })
})

describe("Seed Data - Products", () => {
  it("should have 16 products", () => {
    expect(PRODUCT_SEED).toHaveLength(16)
  })

  it("should have unique SKUs", () => {
    const skus = PRODUCT_SEED.map((p) => p.sku)
    expect(new Set(skus).size).toBe(skus.length)
  })

  it("should cover all 6 product categories", () => {
    const categories = new Set(PRODUCT_SEED.map((p) => p.category))
    expect(categories.size).toBe(6)
    expect(categories).toContain("spots")
    expect(categories).toContain("linear")
    expect(categories).toContain("pendentes")
    expect(categories).toContain("arandelas")
    expect(categories).toContain("plafons")
    expect(categories).toContain("embutidos")
  })

  it("all products should have positive power", () => {
    PRODUCT_SEED.forEach((p) => {
      expect(p.powerWatts).toBeGreaterThan(0)
    })
  })

  it("all products should have positive lumens", () => {
    PRODUCT_SEED.forEach((p) => {
      expect(p.fluxLumens).toBeGreaterThan(0)
    })
  })

  it("all products should have CRI >= 80", () => {
    PRODUCT_SEED.forEach((p) => {
      expect(p.cri).toBeGreaterThanOrEqual(80)
    })
  })

  it("all products should have positive price", () => {
    PRODUCT_SEED.forEach((p) => {
      expect(p.priceBrl).toBeGreaterThan(0)
    })
  })

  it("linear fixtures should have higher lumens than spots", () => {
    const avgLinear =
      PRODUCT_SEED.filter((p) => p.category === "linear").reduce(
        (sum, p) => sum + p.fluxLumens,
        0
      ) /
      PRODUCT_SEED.filter((p) => p.category === "linear").length

    const avgSpots =
      PRODUCT_SEED.filter((p) => p.category === "spots").reduce(
        (sum, p) => sum + p.fluxLumens,
        0
      ) /
      PRODUCT_SEED.filter((p) => p.category === "spots").length

    expect(avgLinear).toBeGreaterThan(avgSpots)
  })
})
