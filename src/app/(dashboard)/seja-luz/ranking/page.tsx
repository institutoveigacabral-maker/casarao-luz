"use client"

import { useState, useEffect } from "react"
import { Trophy, Crown, Medal, Award } from "lucide-react"
import { cn } from "@/lib/utils"

type RankingEntry = {
  position: number
  pointsInPeriod: number
  totalPurchaseAmount: number | null
  professional: {
    fullName: string
    company: string | null
    level: string
  }
}

export default function RankingPage() {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly")
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/seja-luz/ranking?period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        setRanking(data.ranking || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [period])

  const podiumIcons = [Crown, Trophy, Medal]
  const podiumColors = ["text-yellow-400", "text-zinc-300", "text-orange-400"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Ranking Seja Luz</h1>
          <p className="text-sm text-zinc-500">Os profissionais com mais pontos</p>
        </div>
        <div className="flex gap-1 bg-zinc-900/50 rounded-lg p-1">
          <button
            onClick={() => setPeriod("monthly")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              period === "monthly" ? "bg-amber-500/10 text-amber-400" : "text-zinc-500"
            )}
          >
            Mensal
          </button>
          <button
            onClick={() => setPeriod("annual")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              period === "annual" ? "bg-amber-500/10 text-amber-400" : "text-zinc-500"
            )}
          >
            Anual
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
        </div>
      ) : ranking.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Trophy className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Ranking ainda não disponível para este período.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Podium */}
          {ranking.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 0, 2].map((idx) => {
                const entry = ranking[idx]
                if (!entry) return null
                const Icon = podiumIcons[idx]
                const color = podiumColors[idx]
                return (
                  <div
                    key={idx}
                    className={cn(
                      "glass rounded-xl p-4 text-center",
                      idx === 0 && "ring-1 ring-yellow-500/20"
                    )}
                  >
                    <Icon className={cn("w-6 h-6 mx-auto mb-2", color)} />
                    <p className="text-sm font-semibold text-zinc-200">{entry.professional.fullName}</p>
                    <p className="text-[10px] text-zinc-500 mb-2">{entry.professional.company || "-"}</p>
                    <p className="text-lg font-bold text-amber-400">{entry.pointsInPeriod.toLocaleString()} pts</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Full table */}
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-800">
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Profissional</th>
                  <th className="text-left py-3 px-4">Empresa</th>
                  <th className="text-right py-3 px-4">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((entry) => (
                  <tr key={entry.position} className="border-b border-zinc-800/50 text-zinc-300">
                    <td className="py-3 px-4 font-bold">{entry.position}</td>
                    <td className="py-3 px-4">{entry.professional.fullName}</td>
                    <td className="py-3 px-4 text-zinc-500">{entry.professional.company || "-"}</td>
                    <td className="py-3 px-4 text-right font-semibold text-amber-400">{entry.pointsInPeriod.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
