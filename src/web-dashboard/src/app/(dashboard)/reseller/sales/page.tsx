"use client";

import { TrendingUp, Users, Wallet, ArrowUpRight, ArrowDownRight, Download, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function ResellerSalesPage() {
  const sales = [
    { id: 1, customer: 'Marcio Paredão', plan: 'Pulse Mensal', amount: 'R$ 80,00', commission: 'R$ 40,00', date: '13/04/2026', status: 'Concluído' },
    { id: 2, customer: 'Junior CD Som', plan: 'Pulse Anual', amount: 'R$ 680,00', commission: 'R$ 340,00', date: '12/04/2026', status: 'Concluído' },
    { id: 3, customer: 'Equipe Graves', plan: 'Pulse Mensal', amount: 'R$ 80,00', commission: 'R$ 40,00', date: '11/04/2026', status: 'Processando' },
    { id: 4, customer: 'DJ Bruno CD', plan: 'Pulse Trimestral', amount: 'R$ 220,00', commission: 'R$ 110,00', date: '10/04/2026', status: 'Concluído' },
    { id: 5, customer: 'Rei do Som', plan: 'Pulse Mensal', amount: 'R$ 80,00', commission: 'R$ 40,00', date: '09/04/2026', status: 'Concluído' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Minhas Vendas</h1>
          <p className="text-pulse-textSecondary font-medium">Acompanhe seu desempenho e comissões</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-pulse-dark border border-pulse-border hover:bg-pulse-border transition-all px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
            <Calendar size={18} /> Últimos 30 dias
          </button>
          <button className="bg-green-500 hover:bg-green-600 transition-all px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-white uppercase tracking-widest">
            <Wallet size={18} /> Sacar R$ 2.840,00
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-green-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pulse-textSecondary mb-2">Vendas Totais</p>
          <h3 className="text-3xl font-black mb-2">R$ 12.450,00</h3>
          <div className="flex items-center gap-1 text-xs font-bold text-green-500">
            <ArrowUpRight size={14} /> +12% este mês
          </div>
        </div>
        <div className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} className="text-pulse-red" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pulse-textSecondary mb-2">Sua Comissão (50%)</p>
          <h3 className="text-3xl font-black mb-2">R$ 6.225,00</h3>
          <div className="flex items-center gap-1 text-xs font-bold text-pulse-red">
             Meta de R$ 10k próxima
          </div>
        </div>
        <div className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} className="text-blue-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pulse-textSecondary mb-2">Clientes Convertidos</p>
          <h3 className="text-3xl font-black mb-2">142</h3>
          <div className="flex items-center gap-1 text-xs font-bold text-blue-500">
            <ArrowUpRight size={14} /> 28 novos este mês
          </div>
        </div>
      </div>

      <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
            <Download size={20} className="text-pulse-red" /> Histórico de Transações
          </h3>
          <button className="text-xs font-black uppercase tracking-widest text-pulse-red hover:underline">Ver tudo</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-pulse-textSecondary border-b border-pulse-border">
              <tr>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Cliente</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Data</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Plano</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Valor</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-[10px] text-right">Comissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pulse-border">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-5 font-bold text-pulse-textPrimary">{sale.customer}</td>
                  <td className="py-5 text-pulse-textSecondary">{sale.date}</td>
                  <td className="py-5">
                    <span className="px-3 py-1 bg-pulse-dark border border-pulse-border rounded-lg text-[10px] font-bold">
                      {sale.plan}
                    </span>
                  </td>
                  <td className="py-5 font-medium">{sale.amount}</td>
                  <td className="py-5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      sale.status === 'Concluído' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-5 text-right font-black text-green-500">{sale.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
