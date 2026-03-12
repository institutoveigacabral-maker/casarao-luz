"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

const activityTypes = [
  { value: "escritorio_open_plan", label: "Escritório Open Plan" },
  { value: "sala_reuniao", label: "Sala de Reunião" },
  { value: "corredor", label: "Corredor" },
  { value: "lobby", label: "Lobby" },
  { value: "recepcao", label: "Recepção" },
  { value: "copa", label: "Copa" },
  { value: "banheiro", label: "Banheiro" },
  { value: "sala_diretoria", label: "Sala de Diretoria" },
  { value: "auditorio", label: "Auditório" },
  { value: "estacionamento", label: "Estacionamento" },
]

export default function NewSpacePage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [form, setForm] = useState({
    name: "",
    areaM2: "",
    ceilingHeight: "",
    activityType: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.areaM2 || !form.ceilingHeight || !form.activityType) return

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          name: form.name,
          areaM2: parseFloat(form.areaM2),
          ceilingHeight: parseFloat(form.ceilingHeight),
          activityType: form.activityType,
        }),
      })

      if (res.ok) {
        router.push(`/projects/${projectId}`)
      } else {
        const data = await res.json()
        setError(data.error || "Erro ao criar ambiente")
      }
    } catch {
      setError("Erro ao criar ambiente")
    }

    setSubmitting(false)
  }

  const inputClass =
    "w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/projects/${projectId}`}
          className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Novo Ambiente</h1>
          <p className="text-sm text-zinc-500">Adicione um ambiente ao projeto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400">Nome do Ambiente *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Sala de Reunião Principal"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Área (m²) *</label>
            <input
              type="number"
              step="0.1"
              value={form.areaM2}
              onChange={(e) => setForm({ ...form, areaM2: e.target.value })}
              placeholder="Ex: 25.5"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Pé-direito (m) *</label>
            <input
              type="number"
              step="0.1"
              value={form.ceilingHeight}
              onChange={(e) => setForm({ ...form, ceilingHeight: e.target.value })}
              placeholder="Ex: 2.8"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400">Tipo de Atividade (NBR 8995-1) *</label>
          <div className="grid grid-cols-2 gap-2">
            {activityTypes.map((at) => (
              <button
                key={at.value}
                type="button"
                onClick={() => setForm({ ...form, activityType: at.value })}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                  form.activityType === at.value
                    ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/50"
                    : "bg-zinc-900/50 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {at.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !form.name || !form.areaM2 || !form.ceilingHeight || !form.activityType}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          {submitting ? "Criando..." : "Criar Ambiente"}
        </button>
      </form>
    </div>
  )
}
