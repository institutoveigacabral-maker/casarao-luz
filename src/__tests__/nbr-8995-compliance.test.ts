import { describe, it, expect } from "vitest"

/**
 * NBR 8995-1 compliance rules as defined in the seed data.
 * These are the official minimum lux and CRI values per activity type.
 */
const NBR_8995_RULES: Record<string, { minLux: number; minCri: number; description: string }> = {
  escritorio_open_plan: { minLux: 500, minCri: 80, description: "Escritorio aberto / Open plan" },
  sala_reuniao: { minLux: 500, minCri: 80, description: "Sala de reuniao" },
  corredor: { minLux: 100, minCri: 40, description: "Corredor" },
  lobby: { minLux: 200, minCri: 80, description: "Hall de entrada / Lobby" },
  recepcao: { minLux: 300, minCri: 80, description: "Recepcao" },
  copa: { minLux: 200, minCri: 80, description: "Copa / Cozinha" },
  banheiro: { minLux: 200, minCri: 80, description: "Banheiro / Sanitario" },
  sala_diretoria: { minLux: 500, minCri: 80, description: "Sala de diretoria" },
  auditorio: { minLux: 300, minCri: 80, description: "Auditorio" },
  estacionamento: { minLux: 75, minCri: 40, description: "Estacionamento interno" },
}

type ComplianceRule = { activityType: string; minLux: number; minCri: number }

function checkCompliance(
  activityType: string,
  luxLevel: number,
  avgCri: number,
  rules: ComplianceRule[]
): { luxCompliant: boolean; criCompliant: boolean; status: "compliant" | "warning" | "non-compliant" } {
  const rule = rules.find((r) => r.activityType === activityType)
  if (!rule) {
    return { luxCompliant: true, criCompliant: true, status: "compliant" }
  }

  const luxCompliant = luxLevel >= rule.minLux
  const criCompliant = avgCri >= rule.minCri

  let status: "compliant" | "warning" | "non-compliant"
  if (luxCompliant && criCompliant) {
    status = "compliant"
  } else if (luxCompliant || criCompliant) {
    status = "warning"
  } else {
    status = "non-compliant"
  }

  return { luxCompliant, criCompliant, status }
}

const rules: ComplianceRule[] = Object.entries(NBR_8995_RULES).map(([key, val]) => ({
  activityType: key,
  minLux: val.minLux,
  minCri: val.minCri,
}))

describe("NBR 8995-1 Compliance Rules", () => {
  it("should have 10 activity types defined", () => {
    expect(Object.keys(NBR_8995_RULES)).toHaveLength(10)
  })

  it("should require 500 lux for office open plan", () => {
    expect(NBR_8995_RULES.escritorio_open_plan.minLux).toBe(500)
    expect(NBR_8995_RULES.escritorio_open_plan.minCri).toBe(80)
  })

  it("should require 500 lux for meeting rooms", () => {
    expect(NBR_8995_RULES.sala_reuniao.minLux).toBe(500)
  })

  it("should require only 75 lux for parking", () => {
    expect(NBR_8995_RULES.estacionamento.minLux).toBe(75)
    expect(NBR_8995_RULES.estacionamento.minCri).toBe(40)
  })

  it("should require lower CRI for corridors and parking", () => {
    expect(NBR_8995_RULES.corredor.minCri).toBe(40)
    expect(NBR_8995_RULES.estacionamento.minCri).toBe(40)
  })

  it("should require 300 lux for reception", () => {
    expect(NBR_8995_RULES.recepcao.minLux).toBe(300)
  })

  it("should require 300 lux for auditorium", () => {
    expect(NBR_8995_RULES.auditorio.minLux).toBe(300)
  })

  it("should require 200 lux for bathroom", () => {
    expect(NBR_8995_RULES.banheiro.minLux).toBe(200)
  })

  it("should require 500 lux for director office same as open plan", () => {
    expect(NBR_8995_RULES.sala_diretoria.minLux).toBe(NBR_8995_RULES.escritorio_open_plan.minLux)
  })
})

describe("Compliance Check Function", () => {
  it("should return compliant when lux and CRI meet minimums", () => {
    const result = checkCompliance("escritorio_open_plan", 550, 85, rules)
    expect(result.luxCompliant).toBe(true)
    expect(result.criCompliant).toBe(true)
    expect(result.status).toBe("compliant")
  })

  it("should return non-compliant when both lux and CRI fail", () => {
    const result = checkCompliance("escritorio_open_plan", 200, 50, rules)
    expect(result.luxCompliant).toBe(false)
    expect(result.criCompliant).toBe(false)
    expect(result.status).toBe("non-compliant")
  })

  it("should return warning when only lux fails", () => {
    const result = checkCompliance("escritorio_open_plan", 300, 90, rules)
    expect(result.luxCompliant).toBe(false)
    expect(result.criCompliant).toBe(true)
    expect(result.status).toBe("warning")
  })

  it("should return warning when only CRI fails", () => {
    const result = checkCompliance("sala_reuniao", 600, 50, rules)
    expect(result.luxCompliant).toBe(true)
    expect(result.criCompliant).toBe(false)
    expect(result.status).toBe("warning")
  })

  it("should return compliant for unknown activity type (no rule)", () => {
    const result = checkCompliance("unknown_type", 10, 10, rules)
    expect(result.status).toBe("compliant")
  })

  it("should be compliant at exact minimum values", () => {
    const result = checkCompliance("corredor", 100, 40, rules)
    expect(result.luxCompliant).toBe(true)
    expect(result.criCompliant).toBe(true)
    expect(result.status).toBe("compliant")
  })

  it("should be non-compliant just below minimum values", () => {
    const result = checkCompliance("corredor", 99, 39, rules)
    expect(result.luxCompliant).toBe(false)
    expect(result.criCompliant).toBe(false)
    expect(result.status).toBe("non-compliant")
  })

  it("should correctly evaluate parking with low requirements", () => {
    const result = checkCompliance("estacionamento", 80, 45, rules)
    expect(result.status).toBe("compliant")
  })
})
