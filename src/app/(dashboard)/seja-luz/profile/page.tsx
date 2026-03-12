"use client"

import { useState, useEffect } from "react"
import { User, Phone, Building, CreditCard, Shield, Save, AlertCircle, CheckCircle2 } from "lucide-react"

export default function SejaLuzProfilePage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    company: "",
    cpfCnpj: "",
    pixKey: "",
    bankData: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/seja-luz/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.professional) {
          setForm({
            fullName: data.professional.fullName || "",
            phone: data.professional.phone || "",
            company: data.professional.company || "",
            cpfCnpj: data.professional.cpfCnpj || "",
            pixKey: data.professional.pixKey || "",
            bankData: data.professional.bankData || "",
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/seja-luz/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Perfil atualizado com sucesso!" })
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: data.error || "Erro ao salvar" })
      }
    } catch {
      setMessage({ type: "error", text: "Erro ao salvar perfil" })
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Meu Perfil</h1>
        <p className="text-sm text-zinc-500">Dados pessoais e informações de pagamento</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" /> Dados Pessoais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Nome Completo *</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Telefone *</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Empresa</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">CPF/CNPJ</label>
              <input
                value={form.cpfCnpj}
                onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" /> Dados de Pagamento
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Chave PIX</label>
              <input
                value={form.pixKey}
                onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
                placeholder="CPF, email, telefone ou chave aleatória"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Dados Bancários</label>
              <input
                value={form.bankData}
                onChange={(e) => setForm({ ...form, bankData: e.target.value })}
                placeholder="Banco, agência, conta"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <p className="text-[10px] text-zinc-500">Seus dados são criptografados e protegidos.</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}>
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <p className={`text-xs ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
              {message.text}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !form.fullName || !form.phone}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? "Salvando..." : "Salvar Perfil"}
        </button>
      </form>
    </div>
  )
}
