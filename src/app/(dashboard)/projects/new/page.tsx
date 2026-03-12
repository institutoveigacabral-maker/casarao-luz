"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FolderPlus, Building2, Home, ShoppingBag, HeartPulse, GraduationCap } from "lucide-react"
import Link from "next/link"

const projectTypes = [
  { value: "corporativo", label: "Corporativo", icon: Building2, desc: "Escritórios e ambientes empresariais" },
  { value: "residencial", label: "Residencial", icon: Home, desc: "Casas e apartamentos" },
  { value: "comercial", label: "Comercial", icon: ShoppingBag, desc: "Lojas e shoppings" },
  { value: "hospitalar", label: "Hospitalar", icon: HeartPulse, desc: "Clínicas e hospitais" },
  { value: "educacional", label: "Educacional", icon: GraduationCap, desc: "Escolas e universidades" },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !type) {
      setError("Nome e tipo são obrigatórios")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, description }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Erro ao criar projeto")
        setLoading(false)
        return
      }

      router.push(`/projects/${data.project.id}`)
    } catch {
      setError("Erro ao criar projeto")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/projects" className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Novo Projeto</h1>
          <p className="text-sm text-zinc-500">Crie um novo projeto luminotécnico</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Nome do Projeto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Escritório Sede XYZ"
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Tipo do Projeto</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projectTypes.map((pt) => {
              const Icon = pt.icon
              const selected = type === pt.value
              return (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setType(pt.value)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    selected
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selected ? "text-amber-400" : "text-zinc-500"}`} />
                  <div>
                    <p className={`text-sm font-medium ${selected ? "text-amber-400" : "text-zinc-300"}`}>{pt.label}</p>
                    <p className="text-[10px] text-zinc-600">{pt.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Descrição (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição breve do projeto..."
            rows={3}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !name || !type}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          <FolderPlus className="w-4 h-4" />
          {loading ? "Criando..." : "Criar Projeto"}
        </button>
      </form>
    </div>
  )
}
