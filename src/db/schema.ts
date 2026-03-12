import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  pgEnum,
  uuid,
  boolean,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ============================================
// ENUMS
// ============================================

export const projectTypeEnum = pgEnum("project_type", [
  "corporativo",
  "residencial",
  "comercial",
  "hospitalar",
  "educacional",
])

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "submitted",
  "approved",
])

export const activityTypeEnum = pgEnum("activity_type", [
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
])

export const productCategoryEnum = pgEnum("product_category", [
  "spots",
  "linear",
  "pendentes",
  "arandelas",
  "plafons",
  "embutidos",
])

export const complianceStatusEnum = pgEnum("compliance_status", [
  "compliant",
  "warning",
  "non-compliant",
])

export const registrationStatusEnum = pgEnum("registration_status", [
  "incomplete",
  "pending",
  "active",
  "suspended",
])

export const levelEnum = pgEnum("seja_luz_level", [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
])

export const transactionTypeEnum = pgEnum("transaction_type", [
  "purchase",
  "bonus",
  "adjustment",
])

export const rewardTypeEnum = pgEnum("reward_type", [
  "money",
  "travel",
  "product",
  "experience",
])

export const rewardStatusEnum = pgEnum("reward_status", [
  "pending",
  "approved",
  "processing",
  "paid",
  "delivered",
  "cancelled",
])

export const rankingPeriodEnum = pgEnum("ranking_period", [
  "monthly",
  "annual",
])

// ============================================
// USERS
// ============================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  company: text("company"),
  phone: text("phone"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ============================================
// PROJECTS
// ============================================

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    name: text("name").notNull(),
    type: projectTypeEnum("type").notNull(),
    description: text("description"),
    status: projectStatusEnum("status").default("draft").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_projects_user").on(table.userId)]
)

// ============================================
// SPACES (AMBIENTES)
// ============================================

export const spaces = pgTable(
  "spaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    areaM2: real("area_m2").notNull(),
    ceilingHeight: real("ceiling_height").notNull(),
    activityType: activityTypeEnum("activity_type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_spaces_project").on(table.projectId)]
)

// ============================================
// PRODUCTS (CATALOGO LED)
// ============================================

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sku: text("sku").notNull().unique(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    category: productCategoryEnum("category").notNull(),
    fluxLumens: real("flux_lumens"),
    powerWatts: real("power_watts"),
    cctKelvin: integer("cct_kelvin"),
    cri: integer("cri"),
    ipRating: text("ip_rating"),
    beamAngle: real("beam_angle"),
    dimensions: text("dimensions"),
    priceBrl: real("price_brl"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_products_category").on(table.category),
    index("idx_products_brand").on(table.brand),
  ]
)

// ============================================
// BOQ ITEMS (BILL OF QUANTITIES)
// ============================================

export const boqItems = pgTable(
  "boq_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .references(() => spaces.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    quantity: integer("quantity").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_boq_space").on(table.spaceId),
    index("idx_boq_product").on(table.productId),
  ]
)

// ============================================
// COMPLIANCE RULES (NBR 8995-1)
// ============================================

export const complianceRules = pgTable("compliance_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityType: activityTypeEnum("activity_type").notNull().unique(),
  minLux: integer("min_lux").notNull(),
  minCri: integer("min_cri").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================
// SEJA LUZ — PROFESSIONALS
// ============================================

export const professionals = pgTable(
  "professionals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull()
      .unique(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    company: text("company"),
    cpfCnpj: text("cpf_cnpj"),
    pixKey: text("pix_key"),
    bankData: text("bank_data"),
    registrationStatus: registrationStatusEnum("registration_status")
      .default("incomplete")
      .notNull(),
    totalPoints: integer("total_points").default(0).notNull(),
    currentBalance: integer("current_balance").default(0).notNull(),
    level: levelEnum("level").default("bronze").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_professionals_user").on(table.userId),
    index("idx_professionals_level").on(table.level),
  ]
)

// ============================================
// SEJA LUZ — POINT TRANSACTIONS
// ============================================

export const pointTransactions = pgTable(
  "point_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    professionalId: uuid("professional_id")
      .references(() => professionals.id, { onDelete: "cascade" })
      .notNull(),
    transactionType: transactionTypeEnum("transaction_type").notNull(),
    purchaseAmount: real("purchase_amount"),
    pointsEarned: integer("points_earned").notNull(),
    description: text("description"),
    orderReference: text("order_reference"),
    transactionDate: timestamp("transaction_date").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_pt_professional").on(table.professionalId),
    index("idx_pt_date").on(table.transactionDate),
  ]
)

// ============================================
// SEJA LUZ — REWARDS
// ============================================

export const rewards = pgTable(
  "rewards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    professionalId: uuid("professional_id")
      .references(() => professionals.id, { onDelete: "cascade" })
      .notNull(),
    rewardType: rewardTypeEnum("reward_type").notNull(),
    pointsUsed: integer("points_used").notNull(),
    rewardValue: real("reward_value"),
    rewardDescription: text("reward_description"),
    status: rewardStatusEnum("status").default("pending").notNull(),
    requestedAt: timestamp("requested_at").defaultNow().notNull(),
    processedAt: timestamp("processed_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_rewards_professional").on(table.professionalId),
    index("idx_rewards_status").on(table.status),
  ]
)

// ============================================
// SEJA LUZ — RANKINGS
// ============================================

export const rankings = pgTable(
  "rankings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    professionalId: uuid("professional_id")
      .references(() => professionals.id, { onDelete: "cascade" })
      .notNull(),
    periodType: rankingPeriodEnum("period_type").notNull(),
    periodReference: text("period_reference").notNull(),
    pointsInPeriod: integer("points_in_period").notNull(),
    position: integer("position").notNull(),
    totalPurchaseAmount: real("total_purchase_amount"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_rankings_period").on(table.periodType, table.periodReference),
    index("idx_rankings_professional").on(table.professionalId),
  ]
)

// ============================================
// SEJA LUZ — ACHIEVEMENTS
// ============================================

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  professionalId: uuid("professional_id")
    .references(() => professionals.id, { onDelete: "cascade" })
    .notNull(),
  badgeType: text("badge_type").notNull(),
  badgeName: text("badge_name").notNull(),
  badgeDescription: text("badge_description"),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  isDisplayed: boolean("is_displayed").default(true).notNull(),
})

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many, one }) => ({
  projects: many(projects),
  professional: one(professionals),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  spaces: many(spaces),
}))

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  project: one(projects, {
    fields: [spaces.projectId],
    references: [projects.id],
  }),
  boqItems: many(boqItems),
}))

export const boqItemsRelations = relations(boqItems, ({ one }) => ({
  space: one(spaces, {
    fields: [boqItems.spaceId],
    references: [spaces.id],
  }),
  product: one(products, {
    fields: [boqItems.productId],
    references: [products.id],
  }),
}))

export const professionalsRelations = relations(
  professionals,
  ({ one, many }) => ({
    user: one(users, {
      fields: [professionals.userId],
      references: [users.id],
    }),
    pointTransactions: many(pointTransactions),
    rewards: many(rewards),
    rankings: many(rankings),
    achievements: many(achievements),
  })
)

export const pointTransactionsRelations = relations(
  pointTransactions,
  ({ one }) => ({
    professional: one(professionals, {
      fields: [pointTransactions.professionalId],
      references: [professionals.id],
    }),
  })
)

export const rewardsRelations = relations(rewards, ({ one }) => ({
  professional: one(professionals, {
    fields: [rewards.professionalId],
    references: [professionals.id],
  }),
}))

export const rankingsRelations = relations(rankings, ({ one }) => ({
  professional: one(professionals, {
    fields: [rankings.professionalId],
    references: [professionals.id],
  }),
}))

export const achievementsRelations = relations(achievements, ({ one }) => ({
  professional: one(professionals, {
    fields: [achievements.professionalId],
    references: [professionals.id],
  }),
}))
