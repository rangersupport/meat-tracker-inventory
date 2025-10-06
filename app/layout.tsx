import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MeatTracker - Sistema de Inventario",
  description: "Sistema inteligente de gestión de inventario",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}