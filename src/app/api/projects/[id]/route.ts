import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { projects } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), eq(projects.userId, session.user.id)),
    with: {
      spaces: {
        with: {
          boqItems: {
            with: { product: true },
          },
        },
      },
    },
  })

  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
  }

  return NextResponse.json({ project })
}

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
    .update(projects)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
  }

  return NextResponse.json({ project: updated })
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

  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))

  return NextResponse.json({ success: true })
}
