export interface PageVisit {
  path: string
  timestamp: number
  language: string
  timezone: string
}

export interface FeatureEvent {
  feature: string
  timestamp: number
}

const VISITS_KEY = 'yot-analytics-visits'
const FEATURES_KEY = 'yot-analytics-features'
const MAX_VISITS = 500
const MAX_FEATURES = 1000

function safeRead<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as T[]
  } catch {
    return []
  }
}

function safeWrite<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // quota exceeded or unavailable
  }
}

export function trackPageVisit(path: string): void {
  const visits = safeRead<PageVisit>(VISITS_KEY)
  let timezone = 'unknown'
  try {
    timezone = typeof Intl !== 'undefined'
      ? (Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'unknown')
      : 'unknown'
  } catch {
    // Intl not available or timeZone not resolvable
  }
  const visit: PageVisit = {
    path,
    timestamp: Date.now(),
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
    timezone,
  }
  visits.push(visit)
  safeWrite(VISITS_KEY, visits.slice(-MAX_VISITS))
}

export function trackFeatureUsage(feature: string): void {
  const events = safeRead<FeatureEvent>(FEATURES_KEY)
  events.push({ feature, timestamp: Date.now() })
  safeWrite(FEATURES_KEY, events.slice(-MAX_FEATURES))
}

export function getVisitorStats(): {
  totalVisits: number
  uniqueLanguages: { language: string; count: number }[]
  topPages: { path: string; count: number }[]
  visitsPerDay: { date: string; count: number }[]
} {
  const visits = safeRead<PageVisit>(VISITS_KEY)

  const langMap = new Map<string, number>()
  const pageMap = new Map<string, number>()
  const dayMap = new Map<string, number>()

  for (const v of visits) {
    langMap.set(v.language, (langMap.get(v.language) ?? 0) + 1)
    pageMap.set(v.path, (pageMap.get(v.path) ?? 0) + 1)
    const date = new Date(v.timestamp).toISOString().slice(0, 10)
    dayMap.set(date, (dayMap.get(date) ?? 0) + 1)
  }

  const uniqueLanguages = Array.from(langMap.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const topPages = Array.from(pageMap.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const visitsPerDay = Array.from(dayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)

  return { totalVisits: visits.length, uniqueLanguages, topPages, visitsPerDay }
}

export function getRealFeatureUsage(): { feature: string; count: number }[] {
  const events = safeRead<FeatureEvent>(FEATURES_KEY)
  const map = new Map<string, number>()
  for (const e of events) {
    map.set(e.feature, (map.get(e.feature) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}
