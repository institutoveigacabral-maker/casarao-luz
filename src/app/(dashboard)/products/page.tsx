"use client"

import { useState, useEffect } from "react"
import { Search, Lightbulb, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

type Product = {
  id: string
  sku: string
  name: string
  brand: string
  category: string
  fluxLumens: number | null
  powerWatts: number | null
  cctKelvin: number | null
  cri: number | null
  priceBrl: number | null
  beamAngle: number | null
  ipRating: string | null
}

const categories = [
  { value: "", label: "Todas" },
  { value: "spots", label: "Spots" },
  { value: "linear", label: "Linear" },
  { value: "pendentes", label: "Pendentes" },
  { value: "arandelas", label: "Arandelas" },
  { value: "plafons", label: "Plafons" },
  { value: "embutidos", label: "Embutidos" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (search) params.set("search", search)

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Catálogo de Produtos</h1>
        <p className="text-sm text-zinc-500 mt-1">Produtos LED disponíveis para seus projetos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, SKU ou marca..."
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-zinc-900/50 rounded-lg p-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                category === cat.value ? "bg-amber-500/10 text-amber-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-xl p-5 animate-shimmer h-40" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Lightbulb className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="glass rounded-xl p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{product.name}</p>
                  <p className="text-[10px] text-zinc-500">{product.brand} — {product.sku}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 capitalize">
                  {product.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {product.fluxLumens && (
                  <div className="bg-zinc-900/50 rounded p-2">
                    <p className="text-[10px] text-zinc-500">Fluxo</p>
                    <p className="text-xs font-medium text-zinc-300">{product.fluxLumens} lm</p>
                  </div>
                )}
                {product.powerWatts && (
                  <div className="bg-zinc-900/50 rounded p-2">
                    <p className="text-[10px] text-zinc-500">Potência</p>
                    <p className="text-xs font-medium text-zinc-300">{product.powerWatts} W</p>
                  </div>
                )}
                {product.cctKelvin && (
                  <div className="bg-zinc-900/50 rounded p-2">
                    <p className="text-[10px] text-zinc-500">CCT</p>
                    <p className="text-xs font-medium text-zinc-300">{product.cctKelvin} K</p>
                  </div>
                )}
                {product.cri && (
                  <div className="bg-zinc-900/50 rounded p-2">
                    <p className="text-[10px] text-zinc-500">CRI</p>
                    <p className="text-xs font-medium text-zinc-300">{product.cri}</p>
                  </div>
                )}
              </div>

              {product.priceBrl && (
                <p className="text-sm font-bold text-amber-400">
                  R$ {product.priceBrl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
