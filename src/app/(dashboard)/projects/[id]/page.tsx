import { auth } from "@/auth"
import { db } from "@/db/index"
import { projects, complianceRules } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProjectDetailClient from "./ProjectDetailClient"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), eq(projects.userId, session.user.id)),
    with: {
      spaces: {
        with: {
          boqItems: {
            with: { product: true },
          },
        },
      },
    },
  })

  if (!project) notFound()

  const rules = await db.query.complianceRules.findMany()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/projects" className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">{project.name}</h1>
          <p className="text-sm text-zinc-500 capitalize">{project.type} — {project.spaces.length} ambiente(s)</p>
        </div>
      </div>

      <ProjectDetailClient project={project} complianceRules={rules} />
    </div>
  )
}
