import { NextResponse } from "next/server"
import { db } from "@/db/index"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, company } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      )
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (existing) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        company: company || null,
        role: "user",
      })
      .returning()

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
