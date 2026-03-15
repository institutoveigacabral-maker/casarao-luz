import { describe, it, expect } from "vitest"
import {
  projectTypeEnum,
  projectStatusEnum,
  activityTypeEnum,
  productCategoryEnum,
  complianceStatusEnum,
  registrationStatusEnum,
  levelEnum,
  transactionTypeEnum,
  rewardTypeEnum,
  rewardStatusEnum,
  rankingPeriodEnum,
} from "@/db/schema"

describe("Database Schema Enums", () => {
  describe("projectTypeEnum", () => {
    it("should have 5 project types", () => {
      expect(projectTypeEnum.enumValues).toHaveLength(5)
    })

    it("should include all expected project types", () => {
      expect(projectTypeEnum.enumValues).toContain("corporativo")
      expect(projectTypeEnum.enumValues).toContain("residencial")
      expect(projectTypeEnum.enumValues).toContain("comercial")
      expect(projectTypeEnum.enumValues).toContain("hospitalar")
      expect(projectTypeEnum.enumValues).toContain("educacional")
    })
  })

  describe("projectStatusEnum", () => {
    it("should have 3 statuses", () => {
      expect(projectStatusEnum.enumValues).toHaveLength(3)
    })

    it("should include draft, submitted, approved", () => {
      expect(projectStatusEnum.enumValues).toEqual(["draft", "submitted", "approved"])
    })
  })

  describe("activityTypeEnum", () => {
    it("should have 10 activity types matching NBR 8995-1 categories", () => {
      expect(activityTypeEnum.enumValues).toHaveLength(10)
    })

    it("should include all office-related types", () => {
      expect(activityTypeEnum.enumValues).toContain("escritorio_open_plan")
      expect(activityTypeEnum.enumValues).toContain("sala_reuniao")
      expect(activityTypeEnum.enumValues).toContain("sala_diretoria")
    })

    it("should include common area types", () => {
      expect(activityTypeEnum.enumValues).toContain("corredor")
      expect(activityTypeEnum.enumValues).toContain("lobby")
      expect(activityTypeEnum.enumValues).toContain("recepcao")
      expect(activityTypeEnum.enumValues).toContain("copa")
      expect(activityTypeEnum.enumValues).toContain("banheiro")
    })

    it("should include special-purpose types", () => {
      expect(activityTypeEnum.enumValues).toContain("auditorio")
      expect(activityTypeEnum.enumValues).toContain("estacionamento")
    })
  })

  describe("productCategoryEnum", () => {
    it("should have 6 LED product categories", () => {
      expect(productCategoryEnum.enumValues).toHaveLength(6)
    })

    it("should include all lighting fixture categories", () => {
      expect(productCategoryEnum.enumValues).toEqual([
        "spots",
        "linear",
        "pendentes",
        "arandelas",
        "plafons",
        "embutidos",
      ])
    })
  })

  describe("complianceStatusEnum", () => {
    it("should have 3 compliance levels", () => {
      expect(complianceStatusEnum.enumValues).toEqual([
        "compliant",
        "warning",
        "non-compliant",
      ])
    })
  })

  describe("registrationStatusEnum (Seja Luz)", () => {
    it("should have 4 registration statuses", () => {
      expect(registrationStatusEnum.enumValues).toEqual([
        "incomplete",
        "pending",
        "active",
        "suspended",
      ])
    })
  })

  describe("levelEnum (Seja Luz loyalty)", () => {
    it("should have 5 loyalty levels", () => {
      expect(levelEnum.enumValues).toHaveLength(5)
    })

    it("should be ordered from bronze to diamond", () => {
      expect(levelEnum.enumValues).toEqual([
        "bronze",
        "silver",
        "gold",
        "platinum",
        "diamond",
      ])
    })
  })

  describe("transactionTypeEnum", () => {
    it("should have purchase, bonus, adjustment", () => {
      expect(transactionTypeEnum.enumValues).toEqual(["purchase", "bonus", "adjustment"])
    })
  })

  describe("rewardTypeEnum", () => {
    it("should have 4 reward types", () => {
      expect(rewardTypeEnum.enumValues).toEqual(["money", "travel", "product", "experience"])
    })
  })

  describe("rewardStatusEnum", () => {
    it("should have 6 statuses covering full lifecycle", () => {
      expect(rewardStatusEnum.enumValues).toEqual([
        "pending",
        "approved",
        "processing",
        "paid",
        "delivered",
        "cancelled",
      ])
    })
  })

  describe("rankingPeriodEnum", () => {
    it("should have monthly and annual periods", () => {
      expect(rankingPeriodEnum.enumValues).toEqual(["monthly", "annual"])
    })
  })
})
