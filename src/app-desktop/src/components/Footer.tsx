import React from 'react';
import { Usb, HardDrive } from 'lucide-react';

interface FooterProps {
  status: string;
  connected: boolean;
}

export const Footer: React.FC<FooterProps> = ({ status, connected }) => {
  return (
    <footer className="flex items-center justify-between px-6 py-3 bg-pulse-dark border-t border-pulse-border text-xs text-pulse-textSecondary">
      <div className="flex items-center gap-2">
        <Usb size={14} className={connected ? "text-pulse-red" : "text-pulse-textSecondary"} />
        <span>{status}</span>
      </div>
      <div className="flex items-center gap-2">
        <HardDrive size={14} />
        <span>SaaS Pendrive Engine v1.0</span>
      </div>
    </footer>
  );
};
