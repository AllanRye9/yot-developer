import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navigation from '@/components/Navigation'
import ThemeProvider from '@/components/ThemeProvider'
import AnalyticsTracker from '@/components/AnalyticsTracker'

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Blocking theme script – runs before first paint to prevent flash of unstyled content */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){try{
  var t=localStorage.getItem('yot-theme')||'dark';
  var p={
    dark: ['#0a0a0f','#12121a','#1e1e2e','#6366f1','#8b5cf6','#e2e8f0','#64748b'],
    white:['#f8fafc','#ffffff','#e2e8f0','#4f46e5','#7c3aed','#0f172a','#64748b'],
    ocean:['#040d1a','#071424','#0e2040','#0ea5e9','#38bdf8','#e0f2fe','#7ab8d9']
  };
  var c=p[t]||p.dark;
  var r=document.documentElement;
  r.style.setProperty('--color-bg',c[0]);
  r.style.setProperty('--color-card',c[1]);
  r.style.setProperty('--color-border',c[2]);
  r.style.setProperty('--color-accent',c[3]);
  r.style.setProperty('--color-accent-light',c[4]);
  r.style.setProperty('--foreground',c[5]);
  r.style.setProperty('--foreground-muted',c[6]);
  r.style.setProperty('--background',c[0]);
  r.style.background=c[0];
}catch(e){}}());
        `}} />
      </head>
      <body className={`${geist.variable} font-sans bg-[var(--color-bg)] text-[var(--foreground)] min-h-screen`}>
        <ThemeProvider>
          <Navigation />
          <AnalyticsTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
