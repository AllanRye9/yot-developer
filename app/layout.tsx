import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geist = localFont({
  src: [
    { path: './fonts/GeistVF.woff', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: 'YOT Developer - Browser DevTools Platform',
  description: 'Explore, experiment and learn browser dev-tools functionalities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans bg-[#0a0a0f] text-[#e2e8f0] min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
