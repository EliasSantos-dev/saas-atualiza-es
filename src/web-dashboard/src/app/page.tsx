import { Disc, Music, ArrowRight, Zap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-pulse-dark text-pulse-textPrimary selection:bg-pulse-red/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-pulse-border bg-pulse-dark/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 text-pulse-red">
          <Disc size={28} className="animate-[spin_4s_linear_infinite]" />
          <h1 className="text-xl font-bold tracking-wider text-pulse-textPrimary uppercase">
            PULSE<span className="text-pulse-red">DRIVE</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-pulse-red transition-colors">
            Entrar
          </Link>
          <Link href="#pricing" className="bg-pulse-red hover:bg-red-500 transition-all px-6 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(255,59,59,0.3)]">
            Assinar Agora
          </Link>
        </div>
      </nav>

      {/* Hero Section - B2C Focus */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pulse-red rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 -left-24 w-96 h-96 bg-pulse-red rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] rounded-full bg-pulse-red/10 text-pulse-red border border-pulse-red/20 uppercase">
            O Git Pull do seu Som Automotivo
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight uppercase">
            Plugar. Sincronizar. <br />
            <span className="text-pulse-red drop-shadow-[0_0_20px_rgba(255,59,59,0.5)]">Tocar.</span>
          </h1>
          <p className="text-xl md:text-2xl text-pulse-textSecondary mb-12 max-w-3xl mx-auto font-medium">
            Esqueça o copia e cola. Tenha o repertório dos maiores paredões do Brasil atualizado no seu pendrive com apenas um clique. Qualidade 320kbps e volume normalizado sempre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-pulse-red hover:bg-red-500 hover:scale-[1.02] transition-all px-10 py-5 rounded-xl text-lg font-black flex items-center gap-3 justify-center shadow-[0_0_25px_rgba(255,59,59,0.4)]">
              ATUALIZAR MEU PENDRIVE <ArrowRight size={20} />
            </button>
            <button className="bg-pulse-surface hover:bg-pulse-border border border-pulse-border transition-all px-10 py-5 rounded-xl text-lg font-bold flex items-center gap-3 justify-center">
              Ver Planos
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-pulse-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-pulse-surface border border-pulse-border hover:border-pulse-red/50 transition-colors">
              <div className="bg-pulse-red/10 w-14 h-14 rounded-2xl flex items-center justify-center text-pulse-red mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sincronismo Instantâneo</h3>
              <p className="text-pulse-textSecondary leading-relaxed">
                Nossa tecnologia "Delta Sync" identifica o que mudou e baixa apenas as novas faixas. Rápido, leve e inteligente.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-pulse-surface border border-pulse-border hover:border-pulse-red/50 transition-colors">
              <div className="bg-pulse-red/10 w-14 h-14 rounded-2xl flex items-center justify-center text-pulse-red mb-6">
                <Music size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Qualidade de Estúdio</h3>
              <p className="text-pulse-textSecondary leading-relaxed">
                Todas as faixas passam por um processo de normalização de volume (EBU R128) e compressão em 320kbps reais.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-pulse-surface border border-pulse-border hover:border-pulse-red/50 transition-colors">
              <div className="bg-pulse-red/10 w-14 h-14 rounded-2xl flex items-center justify-center text-pulse-red mb-6">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Repertório Atualizado</h3>
              <p className="text-pulse-textSecondary leading-relaxed">
                Nossos robôs monitoram o Spotify e Sua Música 24/7. Se saiu no topo, já está no seu pendrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reseller Section - B2B Focus */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-pulse-red opacity-[0.02] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] rounded-full bg-white/5 text-pulse-textSecondary border border-white/10 uppercase">
              Para DJs e Criadores de Som
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight uppercase">
              Monetize sua <span className="text-pulse-red">Curadoria.</span>
            </h2>
            <p className="text-xl text-pulse-textSecondary mb-10 leading-relaxed">
              Você cria os melhores sets? Transforme seu repertório em um serviço por assinatura. 
              Nós cuidamos do app, dos downloads e dos pagamentos. Você foca na música e lucra com cada assinante.
            </p>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3 font-bold">
                <Users size={20} className="text-pulse-red" /> Gestão de base de clientes
              </li>
              <li className="flex items-center gap-3 font-bold">
                <TrendingUp size={20} className="text-pulse-red" /> Split de pagamentos automático
              </li>
              <li className="flex items-center gap-3 font-bold">
                <Zap size={20} className="text-pulse-red" /> Robô de atualização incluso
              </li>
            </ul>
            <button className="bg-white text-pulse-dark hover:bg-pulse-textPrimary transition-all px-10 py-5 rounded-xl text-lg font-black uppercase">
              Quero ser uma Revenda
            </button>
          </div>
          <div className="flex-1 w-full aspect-video bg-pulse-surface rounded-3xl border border-pulse-border shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pulse-red/10 to-transparent"></div>
            {/* Mock Dashboard UI would go here */}
            <div className="p-8 flex flex-col h-full">
              <div className="flex gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-pulse-red/50"></div>
                <div className="w-3 h-3 rounded-full bg-pulse-border"></div>
                <div className="w-3 h-3 rounded-full bg-pulse-border"></div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="h-8 w-1/3 bg-pulse-border rounded-lg"></div>
                <div className="h-32 w-full bg-pulse-border rounded-xl opacity-50"></div>
                <div className="h-8 w-2/3 bg-pulse-border rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-pulse-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="flex items-center gap-3 text-pulse-red mb-6">
              <Disc size={28} />
              <h2 className="text-xl font-bold tracking-wider text-pulse-textPrimary uppercase">
                PULSE<span className="text-pulse-red">DRIVE</span>
              </h2>
            </div>
            <p className="text-pulse-textSecondary max-w-xs">
              SaaS de curadoria musical focado no ecossistema de som automotivo brasileiro.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-pulse-textPrimary uppercase tracking-widest text-sm">Produto</h4>
              <Link href="#" className="text-pulse-textSecondary hover:text-pulse-red transition-colors">Desktop App</Link>
              <Link href="#" className="text-pulse-textSecondary hover:text-pulse-red transition-colors">Preços</Link>
              <Link href="#" className="text-pulse-textSecondary hover:text-pulse-red transition-colors">Tutoriais</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-pulse-textPrimary uppercase tracking-widest text-sm">Empresa</h4>
              <Link href="#" className="text-pulse-textSecondary hover:text-pulse-red transition-colors">Sobre</Link>
              <Link href="#" className="text-pulse-textSecondary hover:text-pulse-red transition-colors">Termos</Link>
              <Link href="#" className="text-pulse-textSecondary hover:text-pulse-red transition-colors">Suporte</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-pulse-border text-center text-xs text-pulse-textSecondary uppercase tracking-widest">
          &copy; 2026 PulseDrive Engine. Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}
