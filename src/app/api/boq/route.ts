import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { boqItems } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const spaceId = searchParams.get("spaceId")

  if (!spaceId) {
    return NextResponse.json({ error: "spaceId obrigatório" }, { status: 400 })
  }

  const items = await db.query.boqItems.findMany({
    where: eq(boqItems.spaceId, spaceId),
    with: { product: true },
  })

  return NextResponse.json({ boqItems: items })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { spaceId, productId, quantity, notes } = body

    if (!spaceId || !productId || !quantity) {
      return NextResponse.json(
        { error: "spaceId, productId e quantity são obrigatórios" },
        { status: 400 }
      )
    }

    const [item] = await db
      .insert(boqItems)
      .values({
        spaceId,
        productId,
        quantity: parseInt(quantity),
        notes: notes || null,
      })
      .returning()

    return NextResponse.json({ success: true, boqItem: item })
  } catch (error) {
    console.error("Create BOQ item error:", error)
    return NextResponse.json(
      { error: "Erro ao adicionar item" },
      { status: 500 }
    )
  }
}
