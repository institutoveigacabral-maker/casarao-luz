import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { projects, spaces } from "@/db/schema"
import { eq, desc, count } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, session.user.id),
    with: { spaces: true },
    orderBy: [desc(projects.updatedAt)],
  })

  return NextResponse.json({ projects: userProjects })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, type, description } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: "Nome e tipo são obrigatórios" },
        { status: 400 }
      )
    }

    const [project] = await db
      .insert(projects)
      .values({
        userId: session.user.id,
        name,
        type,
        description: description || null,
      })
      .returning()

    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    )
  }
}
