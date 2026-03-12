import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db/index"
import { professionals, pointTransactions, achievements } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import {
  Star,
  Trophy,
  Gift,
  User,
  Target,
  TrendingUp,
  DollarSign,
  Award,
  Crown,
  Medal,
  Sparkles,
} from "lucide-react"

const levelConfig: Record<string, { label: string; color: string; bg: string }> = {
  bronze: { label: "Bronze", color: "text-orange-400", bg: "bg-orange-500/10" },
  silver: { label: "Prata", color: "text-zinc-300", bg: "bg-zinc-500/10" },
  gold: { label: "Ouro", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  platinum: { label: "Platina", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  diamond: { label: "Diamante", color: "text-purple-400", bg: "bg-purple-500/10" },
}

export default async function SejaLuzPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  let professional = await db.query.professionals.findFirst({
    where: eq(professionals.userId, session.user.id),
  })

  if (!professional) {
    const [newPro] = await db
      .insert(professionals)
      .values({
        userId: session.user.id,
        fullName: session.user.name || "Usuario",
        email: session.user.email || "",
        phone: "",
        registrationStatus: "incomplete",
      })
      .returning()
    professional = newPro
  }

  const transactions = await db.query.pointTransactions.findMany({
    where: eq(pointTransactions.professionalId, professional.id),
    orderBy: [desc(pointTransactions.transactionDate)],
    limit: 5,
  })

  const badges = await db.query.achievements.findMany({
    where: eq(achievements.professionalId, professional.id),
    limit: 5,
  })

  const level = levelConfig[professional.level] || levelConfig.bronze

  const quickActions = [
    { href: "/seja-luz/profile", label: "Meu Perfil", icon: User, desc: "Dados pessoais e pagamento" },
    { href: "/seja-luz/ranking", label: "Ranking", icon: Trophy, desc: "Veja sua posição" },
    { href: "/seja-luz/rewards", label: "Recompensas", icon: Gift, desc: "Troque seus pontos" },
  ]

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="glass rounded-2xl p-6 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-zinc-400">Olá,</p>
            <h1 className="text-xl font-bold text-zinc-100">{professional.fullName}</h1>
          </div>
          <div className={`px-3 py-1.5 rounded-full ${level.bg} flex items-center gap-1.5`}>
            <Crown className={`w-3.5 h-3.5 ${level.color}`} />
            <span className={`text-xs font-semibold ${level.color}`}>{level.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-zinc-100">{professional.totalPoints.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500">Pontos Totais</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-zinc-100">{professional.currentBalance.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500">Saldo Disponível</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <TrendingUp className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-zinc-100">-</p>
            <p className="text-[10px] text-zinc-500">Ranking Mensal</p>
          </div>
        </div>
      </div>

      {/* Incomplete profile alert */}
      {professional.registrationStatus === "incomplete" && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-400">Cadastro incompleto</p>
            <p className="text-xs text-zinc-500">Complete seu perfil para participar do programa.</p>
          </div>
          <Link href="/seja-luz/profile" className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg font-medium">
            Completar
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`glass rounded-xl p-5 card-hover group animate-slide-up stagger-${i + 1}`}
            >
              <Icon className="w-5 h-5 text-amber-400 mb-3" />
              <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors">{action.label}</h3>
              <p className="text-xs text-zinc-500 mt-1">{action.desc}</p>
            </Link>
          )
        })}
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">Últimas Transações</h2>
          <div className="glass rounded-xl divide-y divide-zinc-800/60">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs text-zinc-300">{tx.description || tx.transactionType}</p>
                  <p className="text-[10px] text-zinc-600">{new Date(tx.transactionDate).toLocaleDateString("pt-BR")}</p>
                </div>
                <span className="text-sm font-semibold text-green-400">+{tx.pointsEarned} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">Conquistas</h2>
          <div className="flex gap-3 flex-wrap">
            {badges.map((badge) => (
              <div key={badge.id} className="glass rounded-lg p-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-medium text-zinc-200">{badge.badgeName}</p>
                  {badge.badgeDescription && (
                    <p className="text-[10px] text-zinc-500">{badge.badgeDescription}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
