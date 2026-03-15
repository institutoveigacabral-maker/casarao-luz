import { describe, it, expect } from "vitest"

/**
 * Reward rates from /api/seja-luz/rewards/route.ts
 */
const REWARD_RATES: Record<string, number> = {
  money: 0.1,
  travel: 0.08,
  product: 0.12,
  experience: 0.07,
}

function calculateRewardValue(pointsUsed: number, rewardType: string): number {
  const rate = REWARD_RATES[rewardType] || 0.1
  return pointsUsed * rate
}

function validateRewardRequest(
  rewardType: string | undefined,
  pointsUsed: number | undefined,
  totalPoints: number
): { valid: boolean; error?: string } {
  if (!rewardType || !pointsUsed || pointsUsed <= 0) {
    return { valid: false, error: "Dados da recompensa invalidos" }
  }
  if (totalPoints < pointsUsed) {
    return { valid: false, error: "Pontos insuficientes" }
  }
  return { valid: true }
}

function determineRegistrationStatus(pixKey?: string, bankData?: string): "pending" | "incomplete" {
  const hasPaymentInfo = pixKey || bankData
  return hasPaymentInfo ? "pending" : "incomplete"
}

describe("Seja Luz - Reward Rates", () => {
  it("should have 4 reward types", () => {
    expect(Object.keys(REWARD_RATES)).toHaveLength(4)
  })

  it("money should convert at R$0.10 per point", () => {
    expect(REWARD_RATES.money).toBe(0.1)
    expect(calculateRewardValue(1000, "money")).toBe(100)
  })

  it("travel should convert at R$0.08 per point", () => {
    expect(REWARD_RATES.travel).toBe(0.08)
    expect(calculateRewardValue(1000, "travel")).toBe(80)
  })

  it("product should have the best rate at R$0.12 per point", () => {
    expect(REWARD_RATES.product).toBe(0.12)
    expect(calculateRewardValue(1000, "product")).toBe(120)
  })

  it("experience should have the lowest rate at R$0.07 per point", () => {
    expect(REWARD_RATES.experience).toBe(0.07)
    expect(calculateRewardValue(1000, "experience")).toBe(70)
  })

  it("unknown reward type should default to 0.10 rate", () => {
    expect(calculateRewardValue(500, "unknown")).toBe(50)
  })

  it("should calculate correct value for large point amounts", () => {
    expect(calculateRewardValue(50000, "money")).toBe(5000)
    expect(calculateRewardValue(50000, "product")).toBe(6000)
  })
})

describe("Seja Luz - Reward Validation", () => {
  it("should reject when rewardType is undefined", () => {
    const result = validateRewardRequest(undefined, 100, 500)
    expect(result.valid).toBe(false)
  })

  it("should reject when pointsUsed is 0", () => {
    const result = validateRewardRequest("money", 0, 500)
    expect(result.valid).toBe(false)
  })

  it("should reject when pointsUsed is negative", () => {
    const result = validateRewardRequest("money", -100, 500)
    expect(result.valid).toBe(false)
  })

  it("should reject when points exceed balance", () => {
    const result = validateRewardRequest("money", 1000, 500)
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Pontos insuficientes")
  })

  it("should accept valid reward request", () => {
    const result = validateRewardRequest("money", 100, 500)
    expect(result.valid).toBe(true)
  })

  it("should accept when using exact balance", () => {
    const result = validateRewardRequest("travel", 500, 500)
    expect(result.valid).toBe(true)
  })
})

describe("Seja Luz - Registration Status", () => {
  it("should return incomplete when no payment info", () => {
    expect(determineRegistrationStatus()).toBe("incomplete")
    expect(determineRegistrationStatus(undefined, undefined)).toBe("incomplete")
    expect(determineRegistrationStatus("", "")).toBe("incomplete")
  })

  it("should return pending when pixKey is provided", () => {
    expect(determineRegistrationStatus("12345678900")).toBe("pending")
  })

  it("should return pending when bankData is provided", () => {
    expect(determineRegistrationStatus(undefined, "Banco do Brasil AG 1234")).toBe("pending")
  })

  it("should return pending when both are provided", () => {
    expect(determineRegistrationStatus("12345678900", "Banco do Brasil")).toBe("pending")
  })
})
