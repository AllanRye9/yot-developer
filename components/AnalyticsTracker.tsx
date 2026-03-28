'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageVisit } from '@/lib/analytics'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (pathname !== lastPath.current) {
      lastPath.current = pathname
      trackPageVisit(pathname)
    }
  }, [pathname])

  return null
}
