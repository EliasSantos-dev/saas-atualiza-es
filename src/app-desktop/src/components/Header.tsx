import React from 'react';
import { Disc, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-pulse-dark border-b border-pulse-border">
      <div className="flex items-center gap-3 text-pulse-red">
        <Disc size={28} className="animate-[spin_4s_linear_infinite]" />
        <h1 className="text-xl font-bold tracking-wider text-pulse-textPrimary">
          PULSE<span className="text-pulse-red">DRIVE</span>
        </h1>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-pulse-surface hover:bg-pulse-border transition-colors text-pulse-textPrimary">
        <User size={16} />
        Entrar
      </button>
    </header>
  );
};
