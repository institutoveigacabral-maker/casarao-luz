"use client"

import { useSession } from "next-auth/react"
import { User, Mail, Building, Shield } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Configurações</h1>
        <p className="text-sm text-zinc-500">Informações da sua conta</p>
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">{session?.user?.name || "..."}</p>
            <p className="text-xs text-zinc-500">{session?.user?.email || "..."}</p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-400">Email</p>
              <p className="text-sm text-zinc-200">{session?.user?.email || "..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-400">Perfil</p>
              <p className="text-sm text-zinc-200 capitalize">{session?.user?.role || "..."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
