import { describe, it, expect } from "vitest"

/**
 * Tests for product catalog data and filtering logic.
 * Based on seed data and products API route.
 */

type Product = {
  sku: string
  name: string
  brand: string
  category: string
  fluxLumens: number | null
  powerWatts: number | null
  cctKelvin: number | null
  cri: number | null
  ipRating: string | null
  beamAngle: number | null
  priceBrl: number | null
  isActive: boolean
}

const SEED_PRODUCTS: Product[] = [
  { sku: "CL-SP-001", name: "Spot LED Redondo 7W", brand: "CasaRao", category: "spots", fluxLumens: 630, powerWatts: 7, cctKelvin: 3000, cri: 90, beamAngle: 38, ipRating: "IP20", priceBrl: 45.90, isActive: true },
  { sku: "CL-SP-002", name: "Spot LED Redondo 12W", brand: "CasaRao", category: "spots", fluxLumens: 1100, powerWatts: 12, cctKelvin: 4000, cri: 90, beamAngle: 60, ipRating: "IP20", priceBrl: 69.90, isActive: true },
  { sku: "CL-SP-003", name: "Spot LED Direcional 18W", brand: "CasaRao", category: "spots", fluxLumens: 1800, powerWatts: 18, cctKelvin: 3000, cri: 95, beamAngle: 24, ipRating: "IP20", priceBrl: 129.90, isActive: true },
  { sku: "CL-SP-004", name: "Spot LED Mini 5W", brand: "Lumina", category: "spots", fluxLumens: 450, powerWatts: 5, cctKelvin: 2700, cri: 92, beamAngle: 36, ipRating: "IP20", priceBrl: 35.90, isActive: true },
  { sku: "CL-LN-001", name: "Perfil Linear LED 1.2m 36W", brand: "CasaRao", category: "linear", fluxLumens: 3600, powerWatts: 36, cctKelvin: 4000, cri: 90, beamAngle: 120, ipRating: "IP20", priceBrl: 289.90, isActive: true },
  { sku: "CL-LN-002", name: "Perfil Linear LED 0.6m 18W", brand: "CasaRao", category: "linear", fluxLumens: 1800, powerWatts: 18, cctKelvin: 4000, cri: 90, beamAngle: 120, ipRating: "IP20", priceBrl: 169.90, isActive: true },
  { sku: "CL-AR-001", name: "Arandela LED Retangular 12W", brand: "CasaRao", category: "arandelas", fluxLumens: 1000, powerWatts: 12, cctKelvin: 3000, cri: 80, beamAngle: 120, ipRating: "IP65", priceBrl: 189.90, isActive: true },
  { sku: "CL-EM-003", name: "Embutido LED Slim 10W", brand: "Lumina", category: "embutidos", fluxLumens: 900, powerWatts: 10, cctKelvin: 4000, cri: 85, beamAngle: 110, ipRating: "IP44", priceBrl: 59.90, isActive: true },
]

function filterProducts(
  products: Product[],
  filters: { category?: string; brand?: string; search?: string }
): Product[] {
  let result = products.filter((p) => p.isActive)

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category)
  }
  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand)
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower)
    )
  }

  return result
}

function calculateEfficiency(product: Product): number {
  if (!product.fluxLumens || !product.powerWatts || product.powerWatts === 0) return 0
  return product.fluxLumens / product.powerWatts
}

describe("Product Catalog - SKU Format", () => {
  it("should follow CL-XX-NNN format", () => {
    const skuPattern = /^CL-[A-Z]{2}-\d{3}$/
    SEED_PRODUCTS.forEach((p) => {
      expect(p.sku).toMatch(skuPattern)
    })
  })

  it("should have unique SKUs", () => {
    const skus = SEED_PRODUCTS.map((p) => p.sku)
    expect(new Set(skus).size).toBe(skus.length)
  })
})

describe("Product Catalog - Filtering", () => {
  it("should filter by category", () => {
    const spots = filterProducts(SEED_PRODUCTS, { category: "spots" })
    expect(spots).toHaveLength(4)
    spots.forEach((p) => expect(p.category).toBe("spots"))
  })

  it("should filter by brand", () => {
    const lumina = filterProducts(SEED_PRODUCTS, { brand: "Lumina" })
    expect(lumina).toHaveLength(2)
    lumina.forEach((p) => expect(p.brand).toBe("Lumina"))
  })

  it("should filter by search term (name)", () => {
    const result = filterProducts(SEED_PRODUCTS, { search: "linear" })
    expect(result.length).toBeGreaterThanOrEqual(2)
  })

  it("should filter by search term (SKU)", () => {
    const result = filterProducts(SEED_PRODUCTS, { search: "CL-SP" })
    expect(result).toHaveLength(4) // all spots
  })

  it("should filter by search term (brand)", () => {
    const result = filterProducts(SEED_PRODUCTS, { search: "lumina" })
    expect(result).toHaveLength(2)
  })

  it("should combine category and brand filters", () => {
    const result = filterProducts(SEED_PRODUCTS, { category: "spots", brand: "Lumina" })
    expect(result).toHaveLength(1)
    expect(result[0].sku).toBe("CL-SP-004")
  })

  it("should return empty for non-matching filters", () => {
    const result = filterProducts(SEED_PRODUCTS, { category: "pendentes" })
    expect(result).toHaveLength(0)
  })

  it("should exclude inactive products", () => {
    const productsWithInactive = [
      ...SEED_PRODUCTS,
      { ...SEED_PRODUCTS[0], sku: "CL-SP-099", isActive: false },
    ]
    const result = filterProducts(productsWithInactive, {})
    expect(result).toHaveLength(SEED_PRODUCTS.length)
  })
})

describe("Product Catalog - Luminous Efficiency", () => {
  it("should calculate lm/W correctly", () => {
    const spot7w = SEED_PRODUCTS[0] // 630lm / 7W = 90 lm/W
    expect(calculateEfficiency(spot7w)).toBe(90)
  })

  it("should calculate efficiency for linear fixtures", () => {
    const linear36w = SEED_PRODUCTS[4] // 3600lm / 36W = 100 lm/W
    expect(calculateEfficiency(linear36w)).toBe(100)
  })

  it("should return 0 for products without lumens", () => {
    const p: Product = { ...SEED_PRODUCTS[0], fluxLumens: null }
    expect(calculateEfficiency(p)).toBe(0)
  })

  it("should return 0 for products without watts", () => {
    const p: Product = { ...SEED_PRODUCTS[0], powerWatts: null }
    expect(calculateEfficiency(p)).toBe(0)
  })

  it("all seed products should have >= 80 lm/W efficiency", () => {
    SEED_PRODUCTS.forEach((p) => {
      const eff = calculateEfficiency(p)
      expect(eff).toBeGreaterThanOrEqual(80)
    })
  })
})

describe("Product Catalog - IP Rating", () => {
  it("outdoor fixtures should have IP65", () => {
    const arandela = SEED_PRODUCTS.find((p) => p.category === "arandelas")
    expect(arandela?.ipRating).toBe("IP65")
  })

  it("most indoor fixtures should have IP20", () => {
    const indoor = SEED_PRODUCTS.filter((p) => p.ipRating === "IP20")
    expect(indoor.length).toBeGreaterThanOrEqual(6)
  })

  it("bathroom-suitable fixtures should have at least IP44", () => {
    const ip44 = SEED_PRODUCTS.find((p) => p.ipRating === "IP44")
    expect(ip44).toBeDefined()
    expect(ip44?.category).toBe("embutidos")
  })
})

describe("Product Catalog - CRI Values", () => {
  it("all products should have CRI >= 80", () => {
    SEED_PRODUCTS.forEach((p) => {
      if (p.cri) {
        expect(p.cri).toBeGreaterThanOrEqual(80)
      }
    })
  })

  it("premium spots should have CRI >= 90", () => {
    const premiumSpots = SEED_PRODUCTS.filter((p) => p.category === "spots" && (p.priceBrl || 0) > 100)
    premiumSpots.forEach((p) => {
      expect(p.cri).toBeGreaterThanOrEqual(90)
    })
  })
})
