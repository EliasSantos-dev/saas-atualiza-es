"use client";

import { useState } from 'react';
import { Disc, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de login para o MVP (redireciona baseado no e-mail para teste)
    setTimeout(() => {
      if (email.includes('admin')) {
        router.push('/admin');
      } else if (email.includes('revenda')) {
        router.push('/reseller');
      } else {
        router.push('/user');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-pulse-dark text-pulse-textPrimary flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pulse-red rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="text-pulse-red mb-4">
            <Disc size={48} className="animate-[spin_4s_linear_infinite]" />
          </div>
          <h1 className="text-2xl font-black tracking-widest uppercase">
            PULSE<span className="text-pulse-red">DRIVE</span>
          </h1>
          <p className="text-pulse-textSecondary text-sm mt-2">Acesse sua conta para continuar</p>
        </div>

        {/* Login Card */}
        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-pulse-textSecondary mb-2 ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pulse-textSecondary group-focus-within:text-pulse-red transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full bg-pulse-dark border border-pulse-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-pulse-red transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-pulse-textSecondary mb-2 ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pulse-textSecondary group-focus-within:text-pulse-red transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-pulse-dark border border-pulse-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-pulse-red transition-all"
                  required
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-pulse-red hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-4 rounded-xl font-black text-white flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,59,59,0.3)] uppercase tracking-widest"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Entrar na conta <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-pulse-border text-center">
            <p className="text-sm text-pulse-textSecondary">
              Ainda não tem conta?{' '}
              <Link href="/#pricing" className="text-pulse-red font-bold hover:underline">
                Ver Planos
              </Link>
            </p>
          </div>
        </div>

        {/* Demo hints */}
        <div className="mt-8 grid grid-cols-3 gap-2 opacity-40 hover:opacity-100 transition-opacity">
          <div className="text-[10px] text-center border border-pulse-border p-2 rounded-lg cursor-pointer" onClick={() => setEmail('admin@pulse.com')}>Admin Demo</div>
          <div className="text-[10px] text-center border border-pulse-border p-2 rounded-lg cursor-pointer" onClick={() => setEmail('revenda@pulse.com')}>Reseller Demo</div>
          <div className="text-[10px] text-center border border-pulse-border p-2 rounded-lg cursor-pointer" onClick={() => setEmail('user@pulse.com')}>User Demo</div>
        </div>
      </div>
    </main>
  );
}
