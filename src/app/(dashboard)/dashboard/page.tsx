import { auth } from "@/auth"
import { db } from "@/db/index"
import { projects, spaces } from "@/db/schema"
import { eq, desc, count, sql } from "drizzle-orm"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  FolderOpen,
  Plus,
  FileEdit,
  CheckCircle2,
  Layers,
  ArrowRight,
  Building2,
  Home,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
} from "lucide-react"

const typeConfig: Record<string, { icon: typeof Building2; color: string; bg: string }> = {
  corporativo: { icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
  residencial: { icon: Home, color: "text-green-400", bg: "bg-green-500/10" },
  comercial: { icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-500/10" },
  hospitalar: { icon: HeartPulse, color: "text-red-400", bg: "bg-red-500/10" },
  educacional: { icon: GraduationCap, color: "text-cyan-400", bg: "bg-cyan-500/10" },
}

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: "Rascunho", color: "text-zinc-400 bg-zinc-800" },
  submitted: { label: "Enviado", color: "text-amber-400 bg-amber-500/10" },
  approved: { label: "Aprovado", color: "text-green-400 bg-green-500/10" },
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, session.user.id),
    with: { spaces: true },
    orderBy: [desc(projects.updatedAt)],
    limit: 10,
  })

  const totalProjects = userProjects.length
  const drafts = userProjects.filter((p) => p.status === "draft").length
  const approved = userProjects.filter((p) => p.status === "approved").length
  const totalSpaces = userProjects.reduce((sum, p) => sum + (p.spaces?.length || 0), 0)

  const stats = [
    { label: "Total de Projetos", value: totalProjects, icon: FolderOpen, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Rascunhos", value: drafts, icon: FileEdit, color: "text-zinc-400", bg: "bg-zinc-500/10" },
    { label: "Aprovados", value: approved, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Ambientes", value: totalSpaces, icon: Layers, color: "text-blue-400", bg: "bg-blue-500/10" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Visão geral dos seus projetos luminotécnicos</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-900/30"
        >
          <Plus className="w-4 h-4" />
          Novo Projeto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`glass rounded-xl p-5 card-hover animate-slide-up stagger-${i + 1}`}>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-200">Projetos Recentes</h2>
          <Link href="/projects" className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {userProjects.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-sm text-zinc-400 mb-4">Nenhum projeto ainda. Crie seu primeiro projeto luminotécnico.</p>
            <Link href="/projects/new" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Criar Projeto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProjects.map((project, i) => {
              const config = typeConfig[project.type] || typeConfig.corporativo
              const status = statusLabels[project.status] || statusLabels.draft
              const TypeIcon = config.icon

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={`glass rounded-xl p-5 card-hover group animate-slide-up stagger-${(i % 5) + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                      <TypeIcon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-1 group-hover:text-amber-400 transition-colors">{project.name}</h3>
                  <p className="text-xs text-zinc-500 capitalize mb-3">{project.type}</p>
                  {project.description && (
                    <p className="text-xs text-zinc-600 line-clamp-2 mb-3">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-zinc-600">
                    <span>{project.spaces?.length || 0} ambientes</span>
                    <span>{new Date(project.updatedAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
