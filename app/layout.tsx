import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YOT Developer - Browser DevTools Platform',
  description: 'Explore, experiment and learn browser dev-tools functionalities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0f] text-[#e2e8f0] min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
