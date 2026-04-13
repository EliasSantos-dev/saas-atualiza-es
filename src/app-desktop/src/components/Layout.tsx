import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  usbStatus: string;
  usbConnected: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, usbStatus, usbConnected }) => {
  return (
    <div className="flex flex-col h-screen bg-pulse-dark text-pulse-textPrimary overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer status={usbStatus} connected={usbConnected} />
    </div>
  );
};
