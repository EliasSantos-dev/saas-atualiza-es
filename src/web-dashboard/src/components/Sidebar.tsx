"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Music, 
  Download, 
  Settings, 
  Users, 
  TrendingUp, 
  Zap, 
  LogOut,
  Disc,
  HardDrive
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  role: 'admin' | 'reseller' | 'user';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const menuItems = {
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: HardDrive, label: 'Construtor', href: '/admin/pendrive' },
      { icon: Users, label: 'Revendedores', href: '/admin/resellers' },
      { icon: Zap, label: 'Motor Crawler', href: '/admin/engine' },
      { icon: TrendingUp, label: 'Métricas', href: '/admin/metrics' },
    ],
    reseller: [
      { icon: LayoutDashboard, label: 'Meu Painel', href: '/reseller' },
      { icon: TrendingUp, label: 'Minhas Vendas', href: '/reseller/sales' },
      { icon: Music, label: 'Meus Perfis', href: '/reseller/profiles' },
    ],
    user: [
      { icon: LayoutDashboard, label: 'Minha Música', href: '/user' },
      { icon: Download, label: 'Baixar App', href: '/user/download' },
      { icon: Settings, label: 'Assinatura', href: '/user/subscription' },
    ]
  };

  const items = menuItems[role];

  return (
    <aside className="w-64 bg-pulse-surface border-r border-pulse-border flex flex-col h-full">
      <div className="p-6 border-b border-pulse-border flex items-center gap-3 text-pulse-red">
        <Disc size={24} />
        <span className="font-bold tracking-widest text-pulse-textPrimary uppercase">PULSE</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={idx} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-pulse-red/10 text-pulse-red' 
                  : 'hover:bg-pulse-dark hover:text-pulse-red'
              }`}
            >
              <item.icon size={20} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-pulse-border">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-pulse-textSecondary">
          <LogOut size={20} />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
};
