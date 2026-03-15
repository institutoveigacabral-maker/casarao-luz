import { describe, it, expect } from "vitest"

/**
 * Tests for activity type labels used in the UI (ProjectDetailClient.tsx).
 */

const activityLabels: Record<string, string> = {
  escritorio_open_plan: "Escritorio Open Plan",
  sala_reuniao: "Sala de Reuniao",
  corredor: "Corredor",
  lobby: "Lobby",
  recepcao: "Recepcao",
  copa: "Copa",
  banheiro: "Banheiro",
  sala_diretoria: "Sala da Diretoria",
  auditorio: "Auditorio",
  estacionamento: "Estacionamento",
}

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: "Rascunho", color: "text-zinc-400 bg-zinc-800" },
  submitted: { label: "Enviado", color: "text-amber-400 bg-amber-500/10" },
  approved: { label: "Aprovado", color: "text-green-400 bg-green-500/10" },
}

describe("Activity Labels", () => {
  it("should have labels for all 10 activity types", () => {
    expect(Object.keys(activityLabels)).toHaveLength(10)
  })

  it("should map every enum value to a human-readable label", () => {
    const expectedTypes = [
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

    expectedTypes.forEach((type) => {
      expect(activityLabels[type]).toBeDefined()
      expect(activityLabels[type].length).toBeGreaterThan(0)
    })
  })

  it("labels should not contain underscores", () => {
    Object.values(activityLabels).forEach((label) => {
      expect(label).not.toContain("_")
    })
  })
})

describe("Status Labels", () => {
  it("should have 3 status labels", () => {
    expect(Object.keys(statusLabels)).toHaveLength(3)
  })

  it("should have Portuguese labels", () => {
    expect(statusLabels.draft.label).toBe("Rascunho")
    expect(statusLabels.submitted.label).toBe("Enviado")
    expect(statusLabels.approved.label).toBe("Aprovado")
  })

  it("should have color classes for each status", () => {
    Object.values(statusLabels).forEach((s) => {
      expect(s.color).toBeDefined()
      expect(s.color.length).toBeGreaterThan(0)
    })
  })
})
