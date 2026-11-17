import type { Metadata } from "next";
import "./globals.css";
import "./feira-tecnica/feira.css";
export const metadata: Metadata = {title:"Uai Bora? | Descubra o melhor de BH",description:"Eventos, cultura, turismo e lazer em Belo Horizonte. Descubra BH com o Uai Bora. Encontre lugares, exposições, feiras e festivais com informações e fontes oficiais."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="pt-BR"><body>{children}</body></html>}
