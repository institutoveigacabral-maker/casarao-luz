import { describe, it, expect } from "vitest"
import {
  users,
  projects,
  spaces,
  products,
  boqItems,
  complianceRules,
  professionals,
  pointTransactions,
  rewards,
  rankings,
  achievements,
} from "@/db/schema"

describe("Database Table Definitions", () => {
  describe("users table", () => {
    it("should have required columns", () => {
      expect(users.id).toBeDefined()
      expect(users.email).toBeDefined()
      expect(users.name).toBeDefined()
      expect(users.passwordHash).toBeDefined()
      expect(users.role).toBeDefined()
      expect(users.createdAt).toBeDefined()
    })

    it("should have optional columns", () => {
      expect(users.avatarUrl).toBeDefined()
      expect(users.company).toBeDefined()
      expect(users.phone).toBeDefined()
    })
  })

  describe("projects table", () => {
    it("should have required columns", () => {
      expect(projects.id).toBeDefined()
      expect(projects.userId).toBeDefined()
      expect(projects.name).toBeDefined()
      expect(projects.type).toBeDefined()
      expect(projects.status).toBeDefined()
    })

    it("should have timestamp columns", () => {
      expect(projects.createdAt).toBeDefined()
      expect(projects.updatedAt).toBeDefined()
    })
  })

  describe("spaces table", () => {
    it("should have all required measurement columns", () => {
      expect(spaces.areaM2).toBeDefined()
      expect(spaces.ceilingHeight).toBeDefined()
      expect(spaces.activityType).toBeDefined()
    })

    it("should reference project", () => {
      expect(spaces.projectId).toBeDefined()
    })
  })

  describe("products table", () => {
    it("should have LED-specific columns", () => {
      expect(products.fluxLumens).toBeDefined()
      expect(products.powerWatts).toBeDefined()
      expect(products.cctKelvin).toBeDefined()
      expect(products.cri).toBeDefined()
      expect(products.beamAngle).toBeDefined()
      expect(products.ipRating).toBeDefined()
    })

    it("should have commercial columns", () => {
      expect(products.sku).toBeDefined()
      expect(products.name).toBeDefined()
      expect(products.brand).toBeDefined()
      expect(products.category).toBeDefined()
      expect(products.priceBrl).toBeDefined()
      expect(products.isActive).toBeDefined()
    })
  })

  describe("boqItems table (Bill of Quantities)", () => {
    it("should reference space and product", () => {
      expect(boqItems.spaceId).toBeDefined()
      expect(boqItems.productId).toBeDefined()
    })

    it("should have quantity", () => {
      expect(boqItems.quantity).toBeDefined()
    })
  })

  describe("complianceRules table", () => {
    it("should have NBR 8995-1 specific columns", () => {
      expect(complianceRules.activityType).toBeDefined()
      expect(complianceRules.minLux).toBeDefined()
      expect(complianceRules.minCri).toBeDefined()
      expect(complianceRules.description).toBeDefined()
    })
  })

  describe("professionals table (Seja Luz)", () => {
    it("should have loyalty program columns", () => {
      expect(professionals.totalPoints).toBeDefined()
      expect(professionals.currentBalance).toBeDefined()
      expect(professionals.level).toBeDefined()
      expect(professionals.registrationStatus).toBeDefined()
    })

    it("should have payment info columns", () => {
      expect(professionals.cpfCnpj).toBeDefined()
      expect(professionals.pixKey).toBeDefined()
      expect(professionals.bankData).toBeDefined()
    })
  })

  describe("pointTransactions table", () => {
    it("should have transaction columns", () => {
      expect(pointTransactions.professionalId).toBeDefined()
      expect(pointTransactions.transactionType).toBeDefined()
      expect(pointTransactions.purchaseAmount).toBeDefined()
      expect(pointTransactions.pointsEarned).toBeDefined()
      expect(pointTransactions.transactionDate).toBeDefined()
    })
  })

  describe("rewards table", () => {
    it("should have reward-specific columns", () => {
      expect(rewards.professionalId).toBeDefined()
      expect(rewards.rewardType).toBeDefined()
      expect(rewards.pointsUsed).toBeDefined()
      expect(rewards.rewardValue).toBeDefined()
      expect(rewards.status).toBeDefined()
    })
  })

  describe("rankings table", () => {
    it("should have ranking columns", () => {
      expect(rankings.professionalId).toBeDefined()
      expect(rankings.periodType).toBeDefined()
      expect(rankings.periodReference).toBeDefined()
      expect(rankings.pointsInPeriod).toBeDefined()
      expect(rankings.position).toBeDefined()
    })
  })

  describe("achievements table", () => {
    it("should have badge columns", () => {
      expect(achievements.professionalId).toBeDefined()
      expect(achievements.badgeType).toBeDefined()
      expect(achievements.badgeName).toBeDefined()
      expect(achievements.isDisplayed).toBeDefined()
    })
  })
})
