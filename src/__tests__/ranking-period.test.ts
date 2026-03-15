import { describe, it, expect } from "vitest"

/**
 * Tests for ranking period logic from /api/seja-luz/ranking/route.ts
 */

function calculateCurrentPeriod(periodType: "monthly" | "annual", date: Date = new Date()): string {
  if (periodType === "monthly") {
    return date.toISOString().slice(0, 7) // YYYY-MM
  }
  return date.getFullYear().toString() // YYYY
}

function parsePeriodType(input: string | null): "monthly" | "annual" {
  return (input === "annual" ? "annual" : "monthly") as "monthly" | "annual"
}

describe("Ranking Period Calculations", () => {
  describe("Monthly Period", () => {
    it("should format as YYYY-MM", () => {
      const result = calculateCurrentPeriod("monthly", new Date("2026-03-15"))
      expect(result).toBe("2026-03")
    })

    it("should handle January correctly", () => {
      const result = calculateCurrentPeriod("monthly", new Date("2026-01-01"))
      expect(result).toBe("2026-01")
    })

    it("should handle December correctly", () => {
      const result = calculateCurrentPeriod("monthly", new Date("2026-12-31"))
      expect(result).toBe("2026-12")
    })
  })

  describe("Annual Period", () => {
    it("should format as YYYY", () => {
      const result = calculateCurrentPeriod("annual", new Date("2026-03-15"))
      expect(result).toBe("2026")
    })

    it("should be consistent throughout the year", () => {
      const jan = calculateCurrentPeriod("annual", new Date("2026-01-01"))
      const dec = calculateCurrentPeriod("annual", new Date("2026-12-31"))
      expect(jan).toBe(dec)
    })
  })

  describe("Period Type Parsing", () => {
    it("should default to monthly when null", () => {
      expect(parsePeriodType(null)).toBe("monthly")
    })

    it("should default to monthly for unknown values", () => {
      expect(parsePeriodType("weekly")).toBe("monthly")
      expect(parsePeriodType("")).toBe("monthly")
    })

    it("should parse annual", () => {
      expect(parsePeriodType("annual")).toBe("annual")
    })

    it("should parse monthly", () => {
      expect(parsePeriodType("monthly")).toBe("monthly")
    })
  })
})
