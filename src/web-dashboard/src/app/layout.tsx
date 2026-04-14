import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
