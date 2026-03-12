import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db/index"
import { products } from "@/db/schema"
import { eq, and, ilike } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const brand = searchParams.get("brand")
  const search = searchParams.get("search")

  const conditions = [eq(products.isActive, true)]

  if (category) {
    conditions.push(eq(products.category, category as any))
  }
  if (brand) {
    conditions.push(eq(products.brand, brand))
  }

  let allProducts = await db.query.products.findMany({
    where: and(...conditions),
  })

  if (search) {
    const searchLower = search.toLowerCase()
    allProducts = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower)
    )
  }

  return NextResponse.json({ products: allProducts })
}
