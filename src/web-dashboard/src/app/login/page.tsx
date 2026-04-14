"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Disc, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pulse-dark p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-pulse-red/10 p-4 rounded-3xl border border-pulse-red/20 mb-4">
            <Disc size={48} className="text-pulse-red animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-pulse-textPrimary">
            PULSE<span className="text-pulse-red">DRIVE</span>
          </h1>
          <p className="text-pulse-textSecondary font-medium text-sm mt-2 uppercase tracking-widest">
            Painel Administrativo
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-pulse-surface p-8 rounded-[2rem] border border-pulse-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] text-pulse-textSecondary font-black uppercase tracking-widest px-1">Usuário ou E-mail</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pulse-textSecondary group-focus-within:text-pulse-red transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-pulse-dark border border-pulse-border rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:outline-none focus:border-pulse-red transition-all"
                  placeholder="admin@pulsedrive.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-pulse-textSecondary font-black uppercase tracking-widest px-1">Senha</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pulse-textSecondary group-focus-within:text-pulse-red transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-pulse-dark border border-pulse-border rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:outline-none focus:border-pulse-red transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-pulse-red hover:bg-red-500 disabled:opacity-50 transition-all py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(255,59,59,0.3)] mt-2"
            >
              {loading ? 'Entrando...' : 'Acessar Painel'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-pulse-textSecondary font-black uppercase tracking-widest">
          © 2026 PulseDrive Engine • v2.0 NestJS
        </p>
      </div>
    </div>
  );
}
