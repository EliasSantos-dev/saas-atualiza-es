import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseDrive - O Som do seu Carro Atualizado",
  description: "Plataforma de curadoria e sincronização de músicas para pendrives automotivos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-pulse-dark text-pulse-textPrimary font-sans">
        {children}
      </body>
    </html>
  );
}
