import React from 'react'

export const metadata = {
  title: 'Kai Dashboard',
  description: 'Berater-Dashboard für Mandantenverwaltung',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
