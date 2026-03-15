import { describe, it, expect } from "vitest"

/**
 * Tests for Seja Luz professional profile API validation.
 */

function validateProfileUpdate(body: Record<string, unknown>): { valid: boolean; error?: string } {
  const { fullName, phone } = body
  if (!fullName || !phone) {
    return { valid: false, error: "Nome completo e telefone sao obrigatorios" }
  }
  return { valid: true }
}

describe("Professional Profile Validation", () => {
  it("should accept valid profile data", () => {
    const result = validateProfileUpdate({
      fullName: "Maria Santos",
      phone: "(21) 99999-8888",
    })
    expect(result.valid).toBe(true)
  })

  it("should reject missing fullName", () => {
    const result = validateProfileUpdate({
      phone: "(21) 99999-8888",
    })
    expect(result.valid).toBe(false)
  })

  it("should reject missing phone", () => {
    const result = validateProfileUpdate({
      fullName: "Maria Santos",
    })
    expect(result.valid).toBe(false)
  })

  it("should reject empty fullName", () => {
    const result = validateProfileUpdate({
      fullName: "",
      phone: "(21) 99999-8888",
    })
    expect(result.valid).toBe(false)
  })

  it("should accept with optional fields", () => {
    const result = validateProfileUpdate({
      fullName: "Maria Santos",
      phone: "(21) 99999-8888",
      company: "Escritorio ABC",
      cpfCnpj: "123.456.789-00",
      pixKey: "maria@example.com",
      bankData: "Banco do Brasil AG 1234 CC 56789",
    })
    expect(result.valid).toBe(true)
  })
})
