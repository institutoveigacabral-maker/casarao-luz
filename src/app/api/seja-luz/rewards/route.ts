import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { rewards, professionals } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

const REWARD_RATES: Record<string, number> = {
  money: 0.1,
  travel: 0.08,
  product: 0.12,
  experience: 0.07,
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const professional = await db.query.professionals.findFirst({
    where: eq(professionals.userId, session.user.id),
  })

  if (!professional) {
    return NextResponse.json({ rewards: [] })
  }

  const rewardHistory = await db.query.rewards.findMany({
    where: eq(rewards.professionalId, professional.id),
    orderBy: [desc(rewards.requestedAt)],
    limit: 50,
  })

  return NextResponse.json({ rewards: rewardHistory })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { rewardType, pointsUsed, rewardDescription } = body

  if (!rewardType || !pointsUsed || pointsUsed <= 0) {
    return NextResponse.json(
      { error: "Dados da recompensa inválidos" },
      { status: 400 }
    )
  }

  const professional = await db.query.professionals.findFirst({
    where: eq(professionals.userId, session.user.id),
  })

  if (!professional) {
    return NextResponse.json(
      { error: "Perfil profissional não encontrado" },
      { status: 404 }
    )
  }

  if (professional.totalPoints < pointsUsed) {
    return NextResponse.json(
      { error: "Pontos insuficientes" },
      { status: 400 }
    )
  }

  const rate = REWARD_RATES[rewardType] || 0.1
  const rewardValue = pointsUsed * rate

  const [reward] = await db
    .insert(rewards)
    .values({
      professionalId: professional.id,
      rewardType: rewardType as any,
      pointsUsed,
      rewardValue,
      rewardDescription: rewardDescription || null,
    })
    .returning()

  return NextResponse.json({ success: true, reward, estimatedValue: rewardValue })
}
