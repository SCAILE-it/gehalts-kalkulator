import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gehaltskalkulator DACH Tech',
  description: 'Schnelle Orientierung für Tech-Gehälter in Deutschland, Österreich und der Schweiz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}