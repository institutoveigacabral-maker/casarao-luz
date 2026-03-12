import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { spaces } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")

  if (!projectId) {
    return NextResponse.json({ error: "projectId obrigatório" }, { status: 400 })
  }

  const projectSpaces = await db.query.spaces.findMany({
    where: eq(spaces.projectId, projectId),
    with: {
      boqItems: {
        with: { product: true },
      },
    },
  })

  return NextResponse.json({ spaces: projectSpaces })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { projectId, name, areaM2, ceilingHeight, activityType } = body

    if (!projectId || !name || !areaM2 || !ceilingHeight || !activityType) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    const [space] = await db
      .insert(spaces)
      .values({
        projectId,
        name,
        areaM2: parseFloat(areaM2),
        ceilingHeight: parseFloat(ceilingHeight),
        activityType,
      })
      .returning()

    return NextResponse.json({ success: true, space })
  } catch (error) {
    console.error("Create space error:", error)
    return NextResponse.json(
      { error: "Erro ao criar ambiente" },
      { status: 500 }
    )
  }
}
