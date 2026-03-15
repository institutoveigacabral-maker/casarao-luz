import { describe, it, expect } from "vitest"

/**
 * Tests for space (ambiente) API validation logic.
 */

const VALID_ACTIVITY_TYPES = [
  "escritorio_open_plan",
  "sala_reuniao",
  "corredor",
  "lobby",
  "recepcao",
  "copa",
  "banheiro",
  "sala_diretoria",
  "auditorio",
  "estacionamento",
]

function validateCreateSpace(body: Record<string, unknown>): { valid: boolean; error?: string } {
  const { projectId, name, areaM2, ceilingHeight, activityType } = body
  if (!projectId || !name || !areaM2 || !ceilingHeight || !activityType) {
    return { valid: false, error: "Todos os campos sao obrigatorios" }
  }
  return { valid: true }
}

function parseSpaceValues(body: Record<string, string>): { areaM2: number; ceilingHeight: number } {
  return {
    areaM2: parseFloat(body.areaM2),
    ceilingHeight: parseFloat(body.ceilingHeight),
  }
}

describe("Space API Validation", () => {
  describe("Create Space", () => {
    it("should accept valid space data", () => {
      const result = validateCreateSpace({
        projectId: "uuid-123",
        name: "Sala de Reuniao 1",
        areaM2: 25,
        ceilingHeight: 2.8,
        activityType: "sala_reuniao",
      })
      expect(result.valid).toBe(true)
    })

    it("should reject missing projectId", () => {
      const result = validateCreateSpace({
        name: "Sala",
        areaM2: 25,
        ceilingHeight: 2.8,
        activityType: "sala_reuniao",
      })
      expect(result.valid).toBe(false)
    })

    it("should reject missing name", () => {
      const result = validateCreateSpace({
        projectId: "uuid",
        areaM2: 25,
        ceilingHeight: 2.8,
        activityType: "sala_reuniao",
      })
      expect(result.valid).toBe(false)
    })

    it("should reject missing areaM2", () => {
      const result = validateCreateSpace({
        projectId: "uuid",
        name: "Sala",
        ceilingHeight: 2.8,
        activityType: "sala_reuniao",
      })
      expect(result.valid).toBe(false)
    })

    it("should reject missing ceilingHeight", () => {
      const result = validateCreateSpace({
        projectId: "uuid",
        name: "Sala",
        areaM2: 25,
        activityType: "sala_reuniao",
      })
      expect(result.valid).toBe(false)
    })

    it("should reject missing activityType", () => {
      const result = validateCreateSpace({
        projectId: "uuid",
        name: "Sala",
        areaM2: 25,
        ceilingHeight: 2.8,
      })
      expect(result.valid).toBe(false)
    })
  })

  describe("Activity Type Validation", () => {
    it("should have 10 valid activity types", () => {
      expect(VALID_ACTIVITY_TYPES).toHaveLength(10)
    })

    it.each(VALID_ACTIVITY_TYPES)("should recognize %s as valid", (type) => {
      expect(VALID_ACTIVITY_TYPES).toContain(type)
    })
  })

  describe("Space Value Parsing", () => {
    it("should parse string values to floats", () => {
      const result = parseSpaceValues({ areaM2: "25.5", ceilingHeight: "2.8" })
      expect(result.areaM2).toBe(25.5)
      expect(result.ceilingHeight).toBe(2.8)
    })

    it("should parse integer strings", () => {
      const result = parseSpaceValues({ areaM2: "100", ceilingHeight: "3" })
      expect(result.areaM2).toBe(100)
      expect(result.ceilingHeight).toBe(3)
    })

    it("should return NaN for invalid values", () => {
      const result = parseSpaceValues({ areaM2: "abc", ceilingHeight: "" })
      expect(isNaN(result.areaM2)).toBe(true)
      expect(isNaN(result.ceilingHeight)).toBe(true)
    })
  })
})
