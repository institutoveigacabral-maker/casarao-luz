import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { rankings } from "@/db/schema"
import { eq, and, asc } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const periodType = (searchParams.get("period") || "monthly") as "monthly" | "annual"
  const currentPeriod =
    periodType === "monthly"
      ? new Date().toISOString().slice(0, 7)
      : new Date().getFullYear().toString()

  const rankingData = await db.query.rankings.findMany({
    where: and(
      eq(rankings.periodType, periodType),
      eq(rankings.periodReference, currentPeriod)
    ),
    with: { professional: true },
    orderBy: [asc(rankings.position)],
    limit: 50,
  })

  return NextResponse.json({
    ranking: rankingData,
    periodType,
    periodReference: currentPeriod,
  })
}
