import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { boqItems } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const [updated] = await db
    .update(boqItems)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(boqItems.id, id))
    .returning()

  return NextResponse.json({ boqItem: updated })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  await db.delete(boqItems).where(eq(boqItems.id, id))

  return NextResponse.json({ success: true })
}
