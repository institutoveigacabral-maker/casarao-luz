"use client"

import { useState, useEffect } from "react"
import { Gift, DollarSign, Plane, Package, Sparkles, Star, Clock, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Reward = {
  id: string
  rewardType: string
  pointsUsed: number
  rewardValue: number | null
  rewardDescription: string | null
  status: string
  requestedAt: string
}

const rewardTypes = [
  { type: "money", label: "Dinheiro", icon: DollarSign, desc: "10 pontos = R$ 1,00", minPoints: 100, color: "text-green-400", bg: "bg-green-500/10" },
  { type: "travel", label: "Viagens", icon: Plane, desc: "12 pontos = R$ 1,00", minPoints: 500, color: "text-blue-400", bg: "bg-blue-500/10" },
  { type: "product", label: "Produtos", icon: Package, desc: "8 pontos = R$ 1,00", minPoints: 200, color: "text-purple-400", bg: "bg-purple-500/10" },
  { type: "experience", label: "Experiências", icon: Sparkles, desc: "15 pontos = R$ 1,00", minPoints: 1000, color: "text-amber-400", bg: "bg-amber-500/10" },
]

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pendente", color: "text-amber-400", icon: Clock },
  approved: { label: "Aprovado", color: "text-green-400", icon: CheckCircle2 },
  processing: { label: "Processando", color: "text-blue-400", icon: Clock },
  paid: { label: "Pago", color: "text-green-400", icon: CheckCircle2 },
  delivered: { label: "Entregue", color: "text-green-400", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", color: "text-red-400", icon: XCircle },
}

export default function RewardsPage() {
  const [balance, setBalance] = useState(0)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [points, setPoints] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/seja-luz/dashboard").then((r) => r.json()),
      fetch("/api/seja-luz/rewards").then((r) => r.json()),
    ]).then(([dashboard, rewardsData]) => {
      setBalance(dashboard.professional?.totalPoints || 0)
      setRewards(rewardsData.rewards || [])
      setLoading(false)
    })
  }, [])

  async function handleRequest() {
    if (!selectedType || !points) return
    setSubmitting(true)

    const res = await fetch("/api/seja-luz/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rewardType: selectedType,
        pointsUsed: parseInt(points),
      }),
    })

    if (res.ok) {
      setSelectedType(null)
      setPoints("")
      const rewardsData = await fetch("/api/seja-luz/rewards").then((r) => r.json())
      setRewards(rewardsData.rewards || [])
      setBalance((prev) => prev - parseInt(points))
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-5 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Recompensas</h1>
            <p className="text-sm text-zinc-500">Troque seus pontos por benefícios</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Saldo</p>
            <p className="text-2xl font-bold text-amber-400">{balance.toLocaleString()} pts</p>
          </div>
        </div>
      </div>

      {/* Reward cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {rewardTypes.map((rt) => {
          const Icon = rt.icon
          const disabled = balance < rt.minPoints
          return (
            <button
              key={rt.type}
              onClick={() => !disabled && setSelectedType(rt.type)}
              disabled={disabled}
              className={cn(
                "glass rounded-xl p-4 text-left card-hover transition-all",
                selectedType === rt.type && "ring-1 ring-amber-500/50",
                disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <div className={`w-8 h-8 rounded-lg ${rt.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${rt.color}`} />
              </div>
              <p className="text-sm font-semibold text-zinc-200">{rt.label}</p>
              <p className="text-[10px] text-zinc-500 mt-1">{rt.desc}</p>
              <p className="text-[10px] text-zinc-600 mt-1">Min: {rt.minPoints} pts</p>
            </button>
          )
        })}
      </div>

      {/* Request form */}
      {selectedType && (
        <div className="glass rounded-xl p-5 animate-scale-in">
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">
            Solicitar: {rewardTypes.find((r) => r.type === selectedType)?.label}
          </h3>
          <div className="flex gap-3">
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Quantidade de pontos"
              max={balance}
              className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <button
              onClick={handleRequest}
              disabled={submitting || !points || parseInt(points) > balance}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              {submitting ? "Enviando..." : "Solicitar"}
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {rewards.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">Histórico</h2>
          <div className="glass rounded-xl divide-y divide-zinc-800/60">
            {rewards.map((reward) => {
              const status = statusConfig[reward.status] || statusConfig.pending
              const StatusIcon = status.icon
              return (
                <div key={reward.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Gift className="w-4 h-4 text-zinc-600" />
                    <div>
                      <p className="text-xs text-zinc-300 capitalize">{reward.rewardType}</p>
                      <p className="text-[10px] text-zinc-600">{new Date(reward.requestedAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">{reward.pointsUsed} pts</span>
                    <div className={`flex items-center gap-1 ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="text-[10px] font-medium">{status.label}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
