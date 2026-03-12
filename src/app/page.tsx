import Link from "next/link"
import { Lightbulb, ArrowRight, Zap, FileText, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 glass-strong">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center animate-pulse-glow">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-100 tracking-tight">CASARAO LUZ</h1>
              <p className="text-[10px] text-zinc-600 font-mono tracking-widest">PORTAL DO ARQUITETO</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Entrar</Link>
            <Link href="/register" className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Criar Conta</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
            <Lightbulb className="w-9 h-9 text-amber-400" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4 tracking-tight">
            Projetos Luminotécnicos
            <br />
            <span className="gradient-text">Inteligentes</span>
          </h2>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
            Crie projetos de iluminação com conformidade NBR 8995-1 automática,
            BOQ inteligente e relatórios técnicos e executivos profissionais.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-900/30">
              Começar Agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-600 text-zinc-300 px-8 py-3 rounded-lg font-medium transition-colors">
              Já tenho conta
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 card-hover animate-slide-up stagger-1">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-2">Conformidade NBR</h3>
              <p className="text-xs text-zinc-500">Verificação automática de conformidade com NBR 8995-1 para cada ambiente do projeto.</p>
            </div>
            <div className="glass rounded-xl p-6 card-hover animate-slide-up stagger-2">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-2">Relatórios Profissionais</h3>
              <p className="text-xs text-zinc-500">Relatórios técnicos e executivos completos com BOQ, cálculos de lux e ROI.</p>
            </div>
            <div className="glass rounded-xl p-6 card-hover animate-slide-up stagger-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4 mx-auto">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-2">Programa Seja Luz</h3>
              <p className="text-xs text-zinc-500">Acumule pontos em compras, suba de nível e troque por recompensas exclusivas.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800/60 py-6 text-center">
        <p className="text-xs text-zinc-600">CasaRão Luz — Portal do Arquiteto</p>
      </footer>
    </div>
  )
}
