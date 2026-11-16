import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uai Bora",
  description: "Descubra eventos, conecte-se com pessoas e viva experiências únicas em Minas Gerais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 font-sans">
        {children}
      </body>
    </html>
  );
}
