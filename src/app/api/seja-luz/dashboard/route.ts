import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { professionals, pointTransactions, rankings, achievements } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let professional = await db.query.professionals.findFirst({
    where: eq(professionals.userId, session.user.id),
  })

  if (!professional) {
    const [newProfessional] = await db
      .insert(professionals)
      .values({
        userId: session.user.id,
        fullName: session.user.name || "Usuario",
        email: session.user.email || "",
        phone: "",
        registrationStatus: "incomplete",
      })
      .returning()

    professional = newProfessional
  }

  const transactions = await db.query.pointTransactions.findMany({
    where: eq(pointTransactions.professionalId, professional.id),
    orderBy: [desc(pointTransactions.transactionDate)],
    limit: 10,
  })

  const currentMonth = new Date().toISOString().slice(0, 7)
  const ranking = await db.query.rankings.findFirst({
    where: eq(rankings.professionalId, professional.id),
  })

  const badges = await db.query.achievements.findMany({
    where: eq(achievements.professionalId, professional.id),
    limit: 10,
  })

  return NextResponse.json({
    professional,
    transactions,
    ranking: ranking || null,
    achievements: badges,
  })
}
