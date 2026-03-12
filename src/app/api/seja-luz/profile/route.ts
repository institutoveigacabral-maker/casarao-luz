import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { professionals } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { fullName, phone, company, cpfCnpj, pixKey, bankData } = body

  if (!fullName || !phone) {
    return NextResponse.json(
      { error: "Nome completo e telefone são obrigatórios" },
      { status: 400 }
    )
  }

  const hasPaymentInfo = pixKey || bankData
  const registrationStatus = hasPaymentInfo ? "pending" : "incomplete"

  const [updated] = await db
    .update(professionals)
    .set({
      fullName,
      phone,
      company: company || null,
      cpfCnpj: cpfCnpj || null,
      pixKey: pixKey || null,
      bankData: bankData || null,
      registrationStatus: registrationStatus as any,
      updatedAt: new Date(),
    })
    .where(eq(professionals.userId, session.user.id))
    .returning()

  return NextResponse.json({ success: true, professional: updated })
}
