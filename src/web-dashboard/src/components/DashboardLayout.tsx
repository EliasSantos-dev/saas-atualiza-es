"use client";

import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'reseller' | 'user';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-pulse-dark text-pulse-textPrimary overflow-hidden font-sans">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-pulse-dark border-b border-pulse-border flex items-center px-10">
          <h2 className="text-xl font-bold uppercase tracking-widest text-pulse-textSecondary">
            {role} <span className="text-pulse-red">Panel</span>
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-10 bg-pulse-dark/50">
          {children}
        </main>
      </div>
    </div>
  );
}
