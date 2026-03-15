import { describe, it, expect } from "vitest"

/**
 * Tests for user registration API validation logic.
 */

function validateRegistration(body: Record<string, unknown>): { valid: boolean; error?: string } {
  const { name, email, password } = body

  if (!name || !email || !password) {
    return { valid: false, error: "Nome, email e senha sao obrigatorios" }
  }

  if (typeof password === "string" && password.length < 6) {
    return { valid: false, error: "Senha deve ter no minimo 6 caracteres" }
  }

  return { valid: true }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

describe("Registration API Validation", () => {
  it("should accept valid registration data", () => {
    const result = validateRegistration({
      name: "Joao Silva",
      email: "joao@example.com",
      password: "senha123",
    })
    expect(result.valid).toBe(true)
  })

  it("should reject missing name", () => {
    const result = validateRegistration({
      email: "joao@example.com",
      password: "senha123",
    })
    expect(result.valid).toBe(false)
  })

  it("should reject missing email", () => {
    const result = validateRegistration({
      name: "Joao",
      password: "senha123",
    })
    expect(result.valid).toBe(false)
  })

  it("should reject missing password", () => {
    const result = validateRegistration({
      name: "Joao",
      email: "joao@example.com",
    })
    expect(result.valid).toBe(false)
  })

  it("should reject password shorter than 6 characters", () => {
    const result = validateRegistration({
      name: "Joao",
      email: "joao@example.com",
      password: "12345",
    })
    expect(result.valid).toBe(false)
    expect(result.error).toContain("6")
  })

  it("should accept password with exactly 6 characters", () => {
    const result = validateRegistration({
      name: "Joao",
      email: "joao@example.com",
      password: "123456",
    })
    expect(result.valid).toBe(true)
  })

  it("should accept registration with optional company", () => {
    const result = validateRegistration({
      name: "Joao",
      email: "joao@example.com",
      password: "senha123",
      company: "Escritorio ABC",
    })
    expect(result.valid).toBe(true)
  })
})

describe("Email Validation", () => {
  it("should accept valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true)
  })

  it("should accept email with subdomain", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true)
  })

  it("should reject email without @", () => {
    expect(isValidEmail("userexample.com")).toBe(false)
  })

  it("should reject email without domain", () => {
    expect(isValidEmail("user@")).toBe(false)
  })

  it("should reject empty string", () => {
    expect(isValidEmail("")).toBe(false)
  })
})
