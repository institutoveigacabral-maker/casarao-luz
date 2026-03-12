"use client"

import { useState } from "react"
import {
  Layers,
  FileText,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Zap,
  DollarSign,
  Gauge,
} from "lucide-react"
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
}

type BOQItem = {
  id: string
  quantity: number
  notes: string | null
  product: Product | null
}

type Space = {
  id: string
  name: string
  areaM2: number
  ceilingHeight: number
  activityType: string
  boqItems: BOQItem[]
}

type Project = {
  id: string
  name: string
  type: string
  description: string | null
  status: string
  spaces: Space[]
}

type ComplianceRule = {
  activityType: string
  minLux: number
  minCri: number
}

const activityLabels: Record<string, string> = {
  escritorio_open_plan: "Escritório Open Plan",
  sala_reuniao: "Sala de Reunião",
  corredor: "Corredor",
  lobby: "Lobby",
  recepcao: "Recepção",
  copa: "Copa",
  banheiro: "Banheiro",
  sala_diretoria: "Sala da Diretoria",
  auditorio: "Auditório",
  estacionamento: "Estacionamento",
}

function calculateSpaceMetrics(space: Space, rules: ComplianceRule[]) {
  const totalLumens = space.boqItems.reduce(
    (sum, item) => sum + ((item.product?.fluxLumens || 0) * item.quantity),
    0
  )
  const totalWatts = space.boqItems.reduce(
    (sum, item) => sum + ((item.product?.powerWatts || 0) * item.quantity),
    0
  )
  const totalCost = space.boqItems.reduce(
    (sum, item) => sum + ((item.product?.priceBrl || 0) * item.quantity),
    0
  )
  const totalProducts = space.boqItems.reduce((sum, item) => sum + item.quantity, 0)

  const luxLevel = space.areaM2 > 0 ? totalLumens / space.areaM2 : 0
  const efficiency = totalWatts > 0 ? totalLumens / totalWatts : 0

  const rule = rules.find((r) => r.activityType === space.activityType)
  const luxCompliant = rule ? luxLevel >= rule.minLux : true
  const criValues = space.boqItems
    .filter((item) => item.product?.cri)
    .map((item) => item.product!.cri!)
  const avgCri = criValues.length > 0 ? criValues.reduce((a, b) => a + b, 0) / criValues.length : 0
  const criCompliant = rule ? avgCri >= rule.minCri : true

  return {
    totalLumens,
    totalWatts,
    totalCost,
    totalProducts,
    luxLevel,
    efficiency,
    luxCompliant,
    criCompliant,
    avgCri,
    rule,
  }
}

export default function ProjectDetailClient({
  project,
  complianceRules,
}: {
  project: Project
  complianceRules: ComplianceRule[]
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "technical" | "executive">("overview")

  const projectMetrics = project.spaces.map((space) => ({
    space,
    metrics: calculateSpaceMetrics(space, complianceRules),
  }))

  const totalCost = projectMetrics.reduce((sum, { metrics }) => sum + metrics.totalCost, 0)
  const totalWatts = projectMetrics.reduce((sum, { metrics }) => sum + metrics.totalWatts, 0)
  const totalProducts = projectMetrics.reduce((sum, { metrics }) => sum + metrics.totalProducts, 0)
  const compliantSpaces = projectMetrics.filter(
    ({ metrics }) => metrics.luxCompliant && metrics.criCompliant
  ).length

  const tabs = [
    { id: "overview" as const, label: "Visão Geral", icon: Layers },
    { id: "technical" as const, label: "Técnico", icon: FileText },
    { id: "executive" as const, label: "Executivo", icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900/50 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4">
              <DollarSign className="w-4 h-4 text-amber-400 mb-2" />
              <p className="text-lg font-bold text-zinc-100">R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-zinc-500">Custo Total</p>
            </div>
            <div className="glass rounded-xl p-4">
              <Zap className="w-4 h-4 text-yellow-400 mb-2" />
              <p className="text-lg font-bold text-zinc-100">{totalWatts.toFixed(0)} W</p>
              <p className="text-xs text-zinc-500">Potência Total</p>
            </div>
            <div className="glass rounded-xl p-4">
              <Lightbulb className="w-4 h-4 text-orange-400 mb-2" />
              <p className="text-lg font-bold text-zinc-100">{totalProducts}</p>
              <p className="text-xs text-zinc-500">Produtos</p>
            </div>
            <div className="glass rounded-xl p-4">
              <Gauge className="w-4 h-4 text-green-400 mb-2" />
              <p className="text-lg font-bold text-zinc-100">{compliantSpaces}/{project.spaces.length}</p>
              <p className="text-xs text-zinc-500">Conformes NBR</p>
            </div>
          </div>

          {/* Spaces list */}
          {project.spaces.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <p className="text-sm text-zinc-400">Nenhum ambiente adicionado ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectMetrics.map(({ space, metrics }) => (
                <div key={space.id} className="glass rounded-xl p-4 card-hover">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-zinc-200">{space.name}</h3>
                    <div className="flex items-center gap-1">
                      {metrics.luxCompliant && metrics.criCompliant ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : metrics.luxCompliant || metrics.criCompliant ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>{activityLabels[space.activityType] || space.activityType}</span>
                    <span>{space.areaM2} m²</span>
                    <span>{metrics.luxLevel.toFixed(0)} lux</span>
                    <span>{metrics.totalProducts} produtos</span>
                    <span>R$ {metrics.totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Technical Report */}
      {activeTab === "technical" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Relatório Técnico — NBR 8995-1</h3>

            {projectMetrics.map(({ space, metrics }) => (
              <div key={space.id} className="mb-6 last:mb-0">
                <h4 className="text-sm font-medium text-amber-400 mb-3">
                  {space.name} — {activityLabels[space.activityType]}
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="bg-zinc-900/50 rounded-lg p-3">
                    <p className="text-xs text-zinc-500">Iluminância</p>
                    <p className={cn("text-sm font-bold", metrics.luxCompliant ? "text-green-400" : "text-red-400")}>
                      {metrics.luxLevel.toFixed(0)} lux
                    </p>
                    {metrics.rule && (
                      <p className="text-[10px] text-zinc-600">Min: {metrics.rule.minLux} lux</p>
                    )}
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-3">
                    <p className="text-xs text-zinc-500">Fluxo Total</p>
                    <p className="text-sm font-bold text-zinc-200">{metrics.totalLumens.toLocaleString()} lm</p>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-3">
                    <p className="text-xs text-zinc-500">Potência</p>
                    <p className="text-sm font-bold text-zinc-200">{metrics.totalWatts.toFixed(1)} W</p>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-3">
                    <p className="text-xs text-zinc-500">Eficiência</p>
                    <p className="text-sm font-bold text-zinc-200">{metrics.efficiency.toFixed(1)} lm/W</p>
                  </div>
                </div>

                {space.boqItems.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-800">
                          <th className="text-left py-2 px-2">SKU</th>
                          <th className="text-left py-2 px-2">Produto</th>
                          <th className="text-right py-2 px-2">Qtd</th>
                          <th className="text-right py-2 px-2">W</th>
                          <th className="text-right py-2 px-2">lm</th>
                          <th className="text-right py-2 px-2">CCT</th>
                          <th className="text-right py-2 px-2">CRI</th>
                          <th className="text-right py-2 px-2">Preço</th>
                        </tr>
                      </thead>
                      <tbody>
                        {space.boqItems.map((item) => (
                          <tr key={item.id} className="border-b border-zinc-800/50 text-zinc-300">
                            <td className="py-2 px-2 font-mono text-zinc-500">{item.product?.sku || "-"}</td>
                            <td className="py-2 px-2">{item.product?.name || "-"}</td>
                            <td className="py-2 px-2 text-right">{item.quantity}</td>
                            <td className="py-2 px-2 text-right">{item.product?.powerWatts || "-"}</td>
                            <td className="py-2 px-2 text-right">{item.product?.fluxLumens || "-"}</td>
                            <td className="py-2 px-2 text-right">{item.product?.cctKelvin ? `${item.product.cctKelvin}K` : "-"}</td>
                            <td className="py-2 px-2 text-right">{item.product?.cri || "-"}</td>
                            <td className="py-2 px-2 text-right">
                              {item.product?.priceBrl
                                ? `R$ ${(item.product.priceBrl * item.quantity).toFixed(2)}`
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-2 border-t border-zinc-800 pt-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executive Report */}
      {activeTab === "executive" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Relatório Executivo</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 mb-1">Investimento Total</p>
                <p className="text-xl font-bold text-amber-400">R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 mb-1">Potência Instalada</p>
                <p className="text-xl font-bold text-zinc-200">{(totalWatts / 1000).toFixed(2)} kW</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 mb-1">Custo Energia/Ano</p>
                <p className="text-xl font-bold text-zinc-200">
                  R$ {((totalWatts / 1000) * 8 * 252 * 0.85).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-zinc-600">8h/dia, 252 dias, R$0.85/kWh</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 mb-1">Conformidade NBR</p>
                <p className={cn(
                  "text-xl font-bold",
                  compliantSpaces === project.spaces.length ? "text-green-400" : "text-amber-400"
                )}>
                  {project.spaces.length > 0
                    ? `${Math.round((compliantSpaces / project.spaces.length) * 100)}%`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-lg p-4 mb-4">
              <h4 className="text-xs font-medium text-zinc-400 mb-2">Resumo por Ambiente</h4>
              <div className="space-y-2">
                {projectMetrics.map(({ space, metrics }) => (
                  <div key={space.id} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300">{space.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-500">{metrics.luxLevel.toFixed(0)} lux</span>
                      <span className="text-zinc-500">R$ {metrics.totalCost.toFixed(2)}</span>
                      {metrics.luxCompliant && metrics.criCompliant ? (
                        <span className="text-green-400">Conforme</span>
                      ) : (
                        <span className="text-red-400">Não conforme</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {compliantSpaces === project.spaces.length && project.spaces.length > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <p className="text-sm font-medium text-green-400">Aprovação Recomendada</p>
                </div>
                <p className="text-xs text-zinc-400">
                  Todos os ambientes atendem aos requisitos mínimos da NBR 8995-1.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
