"use client";

import { Users, Search, Filter, MoreVertical, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function ResellersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const resellers = [
    { id: 1, name: 'DJ Kel CDS', email: 'kelcds@pulsedrive.com', sales: 156, revenue: 'R$ 6.240,00', status: 'Ativo', joinDate: 'Jan 2026' },
    { id: 2, name: 'Paredão do Sul', email: 'contato@paredaosul.com', sales: 89, revenue: 'R$ 3.560,00', status: 'Ativo', joinDate: 'Fev 2026' },
    { id: 3, name: 'Som Automotivo Pro', email: 'vendas@sompro.com.br', sales: 210, revenue: 'R$ 8.400,00', status: 'Inativo', joinDate: 'Dez 2025' },
    { id: 4, name: 'Equipe Graves', email: 'equipegraves@email.com', sales: 45, revenue: 'R$ 1.800,00', status: 'Ativo', joinDate: 'Mar 2026' },
    { id: 5, name: 'Rei do Som', email: 'reidosom@gmail.com', sales: 12, revenue: 'R$ 480,00', status: 'Ativo', joinDate: 'Abr 2026' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Gestão de Revendedores</h1>
          <p className="text-pulse-textSecondary font-medium">Controle sua rede de afiliados e comissões</p>
        </div>
        <button className="bg-pulse-red hover:bg-red-500 transition-all px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(255,59,59,0.3)] uppercase tracking-widest">
          <UserPlus size={18} /> Novo Revendedor
        </button>
      </div>

      <div className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pulse-textSecondary group-focus-within:text-pulse-red transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-pulse-dark border border-pulse-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-pulse-red transition-all"
            />
          </div>
          <button className="bg-pulse-dark border border-pulse-border px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-pulse-border transition-colors">
            <Filter size={18} /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-pulse-textSecondary border-b border-pulse-border">
              <tr>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Revendedor</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Vendas</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Comissão</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Desde</th>
                <th className="pb-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pulse-border">
              {resellers.map((reseller) => (
                <tr key={reseller.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pulse-red/10 flex items-center justify-center text-pulse-red font-black border border-pulse-red/20">
                        {reseller.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-pulse-textPrimary">{reseller.name}</p>
                        <p className="text-xs text-pulse-textSecondary">{reseller.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 font-bold">{reseller.sales}</td>
                  <td className="py-5 font-black text-green-500">{reseller.revenue}</td>
                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      reseller.status === 'Ativo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {reseller.status}
                    </span>
                  </td>
                  <td className="py-5 text-pulse-textSecondary">{reseller.joinDate}</td>
                  <td className="py-5 text-right">
                    <button className="p-2 hover:bg-pulse-dark rounded-lg transition-colors text-pulse-textSecondary hover:text-pulse-red">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
