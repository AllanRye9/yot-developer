import { NextRequest, NextResponse } from 'next/server'

const TIMEOUT_MS = 12000

// Block private/loopback IP ranges to prevent SSRF
function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase()
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower.endsWith('.localhost')
  ) return true

  // IPv4 private and special-use ranges
  const ipv4Private = [
    /^10\.\d+\.\d+\.\d+$/,
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
    /^192\.168\.\d+\.\d+$/,
    /^169\.254\.\d+\.\d+$/,  // link-local
    /^0\.0\.0\.0$/,
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d+\.\d+$/, // CGNAT
    /^127\.\d+\.\d+\.\d+$/,  // full loopback range
    /^198\.(1[89])\.\d+\.\d+$/,                           // TEST-NET-3
  ]
  if (ipv4Private.some(p => p.test(lower))) return true

  // IPv6 loopback and link-local
  if (lower === '::1') return true
  // Normalise brackets from URLs like [::1]
  const bare = lower.replace(/^\[|\]$/g, '')
  if (bare === '::1') return true
  // Unique-local (fc00::/7) and link-local (fe80::/10)
  if (/^f[cd]/i.test(bare) || /^fe[89ab]/i.test(bare)) return true

  return false
}

function parseCookies(setCookieHeaders: string[]): CookieCheck[] {
  return setCookieHeaders.map(header => {
    const parts = header.split(';').map(p => p.trim())
    const name = parts[0].split('=')[0].trim()
    const attrs = parts.slice(1).map(p => p.toLowerCase())
    return {
      name,
      httpOnly: attrs.some(a => a === 'httponly'),
      secure: attrs.some(a => a === 'secure'),
      sameSite: attrs.find(a => a.startsWith('samesite='))?.split('=')[1] ?? null,
    }
  })
}

interface CookieCheck {
  name: string
  httpOnly: boolean
  secure: boolean
  sameSite: string | null
}

export interface TestItem {
  id: string
  category: 'security' | 'vulnerability' | 'general' | 'performance'
  name: string
  status: 'pass' | 'warn' | 'fail' | 'info'
  detail: string
  tip?: string
}

export interface SiteTestResult {
  url: string
  finalUrl: string
  statusCode: number
  responseTimeMs: number
  tests: TestItem[]
  error?: string
}

export async function POST(req: NextRequest) {
  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const rawUrl = (body.url ?? '').trim()
  if (!rawUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  // Ensure the URL has a scheme
  const urlStr = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`

  let parsed: URL
  try {
    parsed = new URL(urlStr)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only http and https URLs are allowed' }, { status: 400 })
  }

  if (isBlockedHostname(parsed.hostname)) {
    return NextResponse.json({ error: 'Private or loopback addresses are not allowed' }, { status: 400 })
  }

  const tests: TestItem[] = []
  const startTime = Date.now()
  let response: Response | null = null
  let finalUrl = urlStr
  let statusCode = 0

  // ── General: HTTPS check ───────────────────────────────────────────────────
  tests.push({
    id: 'https',
    category: 'security',
    name: 'HTTPS Enabled',
    status: parsed.protocol === 'https:' ? 'pass' : 'fail',
    detail: parsed.protocol === 'https:'
      ? 'Site is served over HTTPS – data in transit is encrypted.'
      : 'Site uses plain HTTP. All data is transmitted unencrypted.',
    tip: parsed.protocol !== 'https:'
      ? 'Obtain a TLS certificate (Let\'s Encrypt is free) and redirect HTTP → HTTPS.'
      : undefined,
  })

  // ── Fetch the page ──────────────────────────────────────────────────────────
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    response = await fetch(urlStr, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'YOT-SiteTester/1.0',
        Accept: 'text/html,application/xhtml+xml,*/*',
      },
    })
    clearTimeout(timer)
    finalUrl = response.url || urlStr
    statusCode = response.status
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    const timedOut = msg.includes('abort') || msg.includes('timed out')
    return NextResponse.json({
      url: urlStr,
      finalUrl: urlStr,
      statusCode: 0,
      responseTimeMs: Date.now() - startTime,
      tests,
      error: timedOut
        ? `Request timed out after ${TIMEOUT_MS / 1000}s.`
        : `Could not reach site: ${msg}`,
    } satisfies SiteTestResult)
  }

  const responseTimeMs = Date.now() - startTime
  const headers = response.headers

  // ── General: Status code ────────────────────────────────────────────────────
  tests.push({
    id: 'status',
    category: 'general',
    name: 'HTTP Status Code',
    status: statusCode >= 200 && statusCode < 400 ? 'pass'
      : statusCode >= 400 && statusCode < 500 ? 'warn' : 'fail',
    detail: `Server responded with HTTP ${statusCode}.`,
    tip: statusCode >= 500 ? 'A 5xx status indicates a server-side error. Check server logs.' : undefined,
  })

  // ── General: Response time ──────────────────────────────────────────────────
  tests.push({
    id: 'response-time',
    category: 'general',
    name: 'Response Time',
    status: responseTimeMs < 1000 ? 'pass' : responseTimeMs < 3000 ? 'warn' : 'fail',
    detail: `Page responded in ${responseTimeMs}ms.`,
    tip: responseTimeMs >= 3000
      ? 'Response time exceeds 3 seconds. Consider server-side caching, CDN, or infrastructure optimisation.'
      : responseTimeMs >= 1000
      ? 'Response time is above 1 second. Profile server-side processing for bottlenecks.'
      : undefined,
  })

  // ── General: Redirect to HTTPS ──────────────────────────────────────────────
  if (parsed.protocol === 'http:' && finalUrl.startsWith('https://')) {
    tests.push({
      id: 'http-redirect',
      category: 'general',
      name: 'HTTP → HTTPS Redirect',
      status: 'pass',
      detail: 'The server correctly redirects HTTP requests to HTTPS.',
    })
  } else if (parsed.protocol === 'http:' && !finalUrl.startsWith('https://')) {
    tests.push({
      id: 'http-redirect',
      category: 'general',
      name: 'HTTP → HTTPS Redirect',
      status: 'fail',
      detail: 'No HTTPS redirect was detected. Visitors on HTTP are not upgraded to a secure connection.',
      tip: 'Configure a 301 redirect from http:// to https:// at the web-server or load-balancer level.',
    })
  }

  // ── Security headers ────────────────────────────────────────────────────────
  const csp = headers.get('content-security-policy')
  tests.push({
    id: 'csp',
    category: 'security',
    name: 'Content-Security-Policy',
    status: csp ? 'pass' : 'fail',
    detail: csp
      ? `CSP header is present: "${csp.slice(0, 120)}${csp.length > 120 ? '…' : ''}"`
      : 'Content-Security-Policy header is missing.',
    tip: !csp
      ? 'Add a CSP header to restrict the sources from which scripts, styles, and other resources can load. Start with a restrictive policy like: default-src \'self\'.'
      : undefined,
  })

  const xfo = headers.get('x-frame-options')
  tests.push({
    id: 'x-frame-options',
    category: 'security',
    name: 'X-Frame-Options',
    status: xfo ? 'pass' : 'warn',
    detail: xfo
      ? `X-Frame-Options: ${xfo}`
      : 'X-Frame-Options header is missing.',
    tip: !xfo
      ? 'Set X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking. Alternatively, use CSP frame-ancestors.'
      : undefined,
  })

  const xcto = headers.get('x-content-type-options')
  tests.push({
    id: 'x-content-type-options',
    category: 'security',
    name: 'X-Content-Type-Options',
    status: xcto === 'nosniff' ? 'pass' : 'warn',
    detail: xcto
      ? `X-Content-Type-Options: ${xcto}`
      : 'X-Content-Type-Options header is missing.',
    tip: !xcto
      ? 'Add X-Content-Type-Options: nosniff to prevent MIME-type sniffing attacks.'
      : undefined,
  })

  const hsts = headers.get('strict-transport-security')
  tests.push({
    id: 'hsts',
    category: 'security',
    name: 'Strict-Transport-Security (HSTS)',
    status: hsts ? 'pass' : parsed.protocol === 'https:' ? 'warn' : 'info',
    detail: hsts
      ? `HSTS header is present: ${hsts}`
      : 'Strict-Transport-Security header is missing.',
    tip: !hsts && parsed.protocol === 'https:'
      ? 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains to enforce HTTPS for one year.'
      : undefined,
  })

  const referrerPolicy = headers.get('referrer-policy')
  tests.push({
    id: 'referrer-policy',
    category: 'security',
    name: 'Referrer-Policy',
    status: referrerPolicy ? 'pass' : 'warn',
    detail: referrerPolicy
      ? `Referrer-Policy: ${referrerPolicy}`
      : 'Referrer-Policy header is missing.',
    tip: !referrerPolicy
      ? 'Set Referrer-Policy (e.g. strict-origin-when-cross-origin) to control how much referrer information is sent with requests.'
      : undefined,
  })

  const permissionsPolicy = headers.get('permissions-policy') || headers.get('feature-policy')
  tests.push({
    id: 'permissions-policy',
    category: 'security',
    name: 'Permissions-Policy',
    status: permissionsPolicy ? 'pass' : 'warn',
    detail: permissionsPolicy
      ? `Permissions-Policy: ${permissionsPolicy}`
      : 'Permissions-Policy header is missing.',
    tip: !permissionsPolicy
      ? 'Add a Permissions-Policy header to restrict access to browser features (camera, microphone, geolocation, etc.).'
      : undefined,
  })

  // ── Vulnerability: Server info exposure ─────────────────────────────────────
  const server = headers.get('server')
  const xPoweredBy = headers.get('x-powered-by')

  tests.push({
    id: 'server-info',
    category: 'vulnerability',
    name: 'Server Information Exposure',
    status: (server || xPoweredBy) ? 'warn' : 'pass',
    detail: server || xPoweredBy
      ? `Server version info is exposed: ${[server && `Server: ${server}`, xPoweredBy && `X-Powered-By: ${xPoweredBy}`].filter(Boolean).join(', ')}`
      : 'No server technology headers detected.',
    tip: (server || xPoweredBy)
      ? 'Remove or redact the Server and X-Powered-By headers to avoid revealing your technology stack to attackers.'
      : undefined,
  })

  // ── Vulnerability: Cookie security ──────────────────────────────────────────
  const rawCookies = response.headers.getSetCookie
    ? response.headers.getSetCookie()
    : (headers.get('set-cookie') ? [headers.get('set-cookie')!] : [])

  if (rawCookies.length > 0) {
    const cookies = parseCookies(rawCookies)
    const insecure = cookies.filter(c => !c.secure || !c.httpOnly)
    tests.push({
      id: 'cookie-security',
      category: 'vulnerability',
      name: 'Cookie Security Flags',
      status: insecure.length === 0 ? 'pass' : 'warn',
      detail: insecure.length === 0
        ? `All ${cookies.length} cookie(s) have Secure and HttpOnly flags set.`
        : `${insecure.length} of ${cookies.length} cookie(s) are missing Secure or HttpOnly flags: ${insecure.map(c => c.name).join(', ')}.`,
      tip: insecure.length > 0
        ? 'Set the Secure and HttpOnly flags on all session and authentication cookies. Additionally set SameSite=Strict or SameSite=Lax to prevent CSRF.'
        : undefined,
    })
  }

  // ── Vulnerability: Clickjacking (consolidated) ───────────────────────────────
  const hasClickjackProtection = !!(xfo || csp?.includes('frame-ancestors'))
  tests.push({
    id: 'clickjacking',
    category: 'vulnerability',
    name: 'Clickjacking Protection',
    status: hasClickjackProtection ? 'pass' : 'fail',
    detail: hasClickjackProtection
      ? 'Clickjacking protection is in place (X-Frame-Options or CSP frame-ancestors).'
      : 'No clickjacking protection found. The page can be embedded in an iframe by any site.',
    tip: !hasClickjackProtection
      ? 'Add X-Frame-Options: DENY or include frame-ancestors \'none\' in your CSP.'
      : undefined,
  })

  // ── Vulnerability: Mixed content risk (for HTTPS pages) ──────────────────────
  if (finalUrl.startsWith('https://')) {
    let body: string | null = null
    try {
      body = await response.text()
    } catch { /* ignore read errors */ }

    if (body) {
      // Match http:// references in src/href/action/url attributes (quoted or unquoted)
      const httpRefPattern = /(?:src|href|action|url)\s*=\s*["']?\s*http:\/\//gi
      const httpLinks = (body.match(httpRefPattern) || []).length
      tests.push({
        id: 'mixed-content',
        category: 'vulnerability',
        name: 'Mixed Content',
        status: httpLinks === 0 ? 'pass' : 'warn',
        detail: httpLinks === 0
          ? 'No obvious HTTP resource references detected in page source.'
          : `Found ${httpLinks} reference(s) to plain HTTP resources on an HTTPS page. Browsers may block these.`,
        tip: httpLinks > 0
          ? 'Update all resource URLs (images, scripts, stylesheets) to use https:// to avoid mixed-content warnings.'
          : undefined,
      })
    }
  }

  // ── Vulnerability: Sensitive path probing ───────────────────────────────────
  const sensitivePaths = ['/.env', '/.git/config', '/config.json', '/server-status']
  const exposedPaths: string[] = []

  await Promise.all(
    sensitivePaths.map(async (p) => {
      const target = new URL(p, finalUrl).href
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 5000)
        const r = await fetch(target, {
          method: 'HEAD',
          redirect: 'follow',
          signal: controller.signal,
          headers: { 'User-Agent': 'YOT-SiteTester/1.0' },
        })
        clearTimeout(timer)
        if (r.status === 200) exposedPaths.push(p)
      } catch { /* unreachable path – ignore */ }
    })
  )

  tests.push({
    id: 'sensitive-files',
    category: 'vulnerability',
    name: 'Sensitive File Exposure',
    status: exposedPaths.length === 0 ? 'pass' : 'fail',
    detail: exposedPaths.length === 0
      ? 'No sensitive files (.env, .git/config, config.json, server-status) are publicly accessible.'
      : `Sensitive file(s) are publicly accessible: ${exposedPaths.join(', ')}`,
    tip: exposedPaths.length > 0
      ? 'Block access to these paths immediately in your web server configuration and audit what data may have been exposed.'
      : undefined,
  })

  // ── General: robots.txt ──────────────────────────────────────────────────────
  try {
    const robotsUrl = new URL('/robots.txt', finalUrl).href
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const r = await fetch(robotsUrl, { signal: controller.signal, headers: { 'User-Agent': 'YOT-SiteTester/1.0' } })
    clearTimeout(timer)
    tests.push({
      id: 'robots',
      category: 'general',
      name: 'robots.txt',
      status: r.status === 200 ? 'pass' : 'warn',
      detail: r.status === 200
        ? 'robots.txt is present.'
        : `robots.txt returned HTTP ${r.status}.`,
      tip: r.status !== 200
        ? 'Create a /robots.txt file to guide search-engine crawlers and protect sensitive paths.'
        : undefined,
    })
  } catch { /* ignore */ }

  // ── Performance: Response time (detailed) ────────────────────────────────────
  tests.push({
    id: 'perf-load-time',
    category: 'performance',
    name: 'Page Load Time',
    status: responseTimeMs < 800 ? 'pass' : responseTimeMs < 2000 ? 'warn' : 'fail',
    detail: responseTimeMs < 800
      ? `Excellent load time: ${responseTimeMs}ms (target < 800ms).`
      : responseTimeMs < 2000
      ? `Acceptable load time: ${responseTimeMs}ms. Target is under 800ms for best user experience.`
      : `Slow load time: ${responseTimeMs}ms. Google recommends Time to First Byte (TTFB) under 800ms.`,
    tip: responseTimeMs >= 800
      ? 'Reduce TTFB with server-side caching (Redis/Varnish), a CDN, or optimised database queries. Consider edge deployment.'
      : undefined,
  })

  // ── Performance: Content compression ─────────────────────────────────────────
  const contentEncoding = headers.get('content-encoding')
  const isCompressed = !!(contentEncoding && /gzip|br|zstd|deflate/i.test(contentEncoding))
  tests.push({
    id: 'compression',
    category: 'performance',
    name: 'Content Compression',
    status: isCompressed ? 'pass' : 'warn',
    detail: isCompressed
      ? `Response is compressed with: ${contentEncoding}. Reduces transfer size significantly.`
      : 'No compression detected (Content-Encoding header absent). Responses are sent uncompressed.',
    tip: !isCompressed
      ? 'Enable Gzip or Brotli compression on your server. Brotli (br) provides 20–26% better compression than Gzip. In nginx: "gzip on;" or "brotli on;".'
      : undefined,
  })

  // ── Performance: Cache-Control ────────────────────────────────────────────────
  const cacheControl = headers.get('cache-control')
  const etag = headers.get('etag')
  const lastModified = headers.get('last-modified')
  const hasCacheHeaders = !!(cacheControl || etag || lastModified)
  const hasNoCacheDirective = !!(cacheControl && /no-store|no-cache/i.test(cacheControl))
  const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/i)
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : null

  tests.push({
    id: 'cache-control',
    category: 'performance',
    name: 'Cache-Control Headers',
    status: hasCacheHeaders && !hasNoCacheDirective && (maxAge === null || maxAge > 0) ? 'pass'
      : hasCacheHeaders ? 'info'
      : 'warn',
    detail: cacheControl
      ? `Cache-Control: ${cacheControl}${etag ? `; ETag present` : ''}${lastModified ? `; Last-Modified present` : ''}`
      : etag || lastModified
      ? `No Cache-Control header, but ${[etag && 'ETag', lastModified && 'Last-Modified'].filter(Boolean).join(' and ')} are present for conditional requests.`
      : 'No caching headers detected. Every request will fetch the full response from the server.',
    tip: !hasCacheHeaders
      ? 'Add Cache-Control headers (e.g. max-age=86400 for 1 day) and ETag or Last-Modified for conditional requests. This dramatically reduces server load and improves repeat-visit performance.'
      : undefined,
  })

  // ── Performance: CDN / Edge delivery ─────────────────────────────────────────
  const cfRay = headers.get('cf-ray')
  const xVercel = headers.get('x-vercel-id') || headers.get('x-vercel-cache')
  const xAmz = headers.get('x-amz-cf-id') || headers.get('x-amz-request-id')
  const xFastly = headers.get('x-served-by')?.includes('cache') || headers.get('x-cache')?.toLowerCase().includes('hit')
  const cdnDetected = cfRay ? 'Cloudflare'
    : xVercel ? 'Vercel Edge Network'
    : xAmz ? 'AWS CloudFront'
    : xFastly ? 'Fastly / CDN cache hit'
    : null
  tests.push({
    id: 'cdn',
    category: 'performance',
    name: 'CDN / Edge Delivery',
    status: cdnDetected ? 'pass' : 'info',
    detail: cdnDetected
      ? `CDN detected: ${cdnDetected}. Assets are served from edge nodes close to users.`
      : 'No CDN signature detected. Content appears to be served directly from the origin server.',
    tip: !cdnDetected
      ? 'Use a CDN (Cloudflare, Fastly, AWS CloudFront) to serve static assets from edge nodes worldwide, reducing latency for global users by 50–90%.'
      : undefined,
  })

  // ── Performance: HTTP/2 or HTTP/3 ────────────────────────────────────────────
  // Node.js fetch doesn't expose protocol version directly; infer from headers
  const altSvc = headers.get('alt-svc')
  const http2Hint = altSvc && (altSvc.includes('h2') || altSvc.includes('h3'))
  const upgradeHeader = headers.get('upgrade')
  tests.push({
    id: 'http-version',
    category: 'performance',
    name: 'Modern Protocol (HTTP/2 or HTTP/3)',
    status: http2Hint ? 'pass' : 'info',
    detail: http2Hint
      ? `Alt-Svc header indicates modern protocol support: ${altSvc}`
      : upgradeHeader
      ? `Upgrade header present: ${upgradeHeader}`
      : 'HTTP/2 or HTTP/3 support could not be confirmed from response headers. Check server configuration.',
    tip: !http2Hint
      ? 'Enable HTTP/2 (or HTTP/3) on your server. HTTP/2 multiplexing eliminates head-of-line blocking and significantly speeds up page loads with many assets. Most modern web servers support it with a simple config change.'
      : undefined,
  })

  // ── Performance: Resource hints ───────────────────────────────────────────────
  const linkHeader = headers.get('link')
  const hasPreload = !!(linkHeader && linkHeader.includes('preload'))
  const hasPrefetch = !!(linkHeader && linkHeader.includes('prefetch'))
  const hasDnsPrefetch = !!(linkHeader && linkHeader.includes('dns-prefetch'))
  const hasResourceHints = hasPreload || hasPrefetch || hasDnsPrefetch
  tests.push({
    id: 'resource-hints',
    category: 'performance',
    name: 'Resource Hints (preload / prefetch)',
    status: hasResourceHints ? 'pass' : 'info',
    detail: hasResourceHints
      ? `Resource hints found in Link header: ${[hasPreload && 'preload', hasPrefetch && 'prefetch', hasDnsPrefetch && 'dns-prefetch'].filter(Boolean).join(', ')}.`
      : 'No Link header with resource hints detected. Consider using preload/prefetch for critical assets.',
    tip: !hasResourceHints
      ? 'Add <link rel="preload"> for critical fonts and scripts, <link rel="prefetch"> for next-page resources, and <link rel="dns-prefetch"> for third-party domains to improve perceived performance.'
      : undefined,
  })

  // ── Performance: Vary header (correct caching) ────────────────────────────────
  const varyHeader = headers.get('vary')
  if (isCompressed) {
    tests.push({
      id: 'vary',
      category: 'performance',
      name: 'Vary Header (Encoding)',
      status: varyHeader?.toLowerCase().includes('accept-encoding') ? 'pass' : 'warn',
      detail: varyHeader?.toLowerCase().includes('accept-encoding')
        ? `Vary: ${varyHeader} — caches will correctly store separate compressed/uncompressed versions.`
        : `Response is compressed but Vary: Accept-Encoding is ${varyHeader ? `set to "${varyHeader}"` : 'missing'}. Proxy caches may serve the wrong version to clients.`,
      tip: !(varyHeader?.toLowerCase().includes('accept-encoding'))
        ? 'Add "Vary: Accept-Encoding" so CDNs and proxies store separate cached copies for clients that support and do not support compression.'
        : undefined,
    })
  }

  // ── Performance: Device compatibility (viewport meta) via HTML scan ──────────
  // We already read the body for mixed-content; re-use if available (body may be null for HTTP sites)
  // Do a lightweight second read only if we haven't consumed the body yet
  // (For HTTP URLs we skipped the body read, so attempt it now.)
  if (!finalUrl.startsWith('https://')) {
    // For HTTP-only pages attempt body scan for device compatibility hints
    try {
      const ctrl2 = new AbortController()
      const t2 = setTimeout(() => ctrl2.abort(), 6000)
      const r2 = await fetch(finalUrl, { method: 'GET', redirect: 'follow', signal: ctrl2.signal, headers: { 'User-Agent': 'YOT-SiteTester/1.0', Accept: 'text/html' } })
      clearTimeout(t2)
      const bodyText = await r2.text()
      const hasViewport = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(bodyText)
      tests.push({
        id: 'device-compatibility',
        category: 'performance',
        name: 'Responsive / Device Compatibility',
        status: hasViewport ? 'pass' : 'warn',
        detail: hasViewport
          ? 'Viewport meta tag found — page is configured for responsive/mobile rendering.'
          : 'No viewport meta tag detected. The page may not render correctly on mobile devices.',
        tip: !hasViewport
          ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to ensure the page scales correctly on all screen sizes.'
          : undefined,
      })
    } catch { /* ignore body read errors */ }
  } else {
    // For HTTPS pages the body was already read for mixed-content check; add device compatibility based on that scan
    // Re-read body since response was already consumed — use a new fetch
    try {
      const ctrl3 = new AbortController()
      const t3 = setTimeout(() => ctrl3.abort(), 6000)
      const r3 = await fetch(finalUrl, { method: 'GET', redirect: 'follow', signal: ctrl3.signal, headers: { 'User-Agent': 'YOT-SiteTester/1.0', Accept: 'text/html' } })
      clearTimeout(t3)
      const bodyText3 = await r3.text()
      const hasViewport3 = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(bodyText3)
      const hasCharset = /<meta[^>]+charset/i.test(bodyText3)
      tests.push({
        id: 'device-compatibility',
        category: 'performance',
        name: 'Responsive / Device Compatibility',
        status: hasViewport3 ? 'pass' : 'warn',
        detail: hasViewport3
          ? `Viewport meta tag found — page is configured for responsive/mobile rendering.${hasCharset ? ' Charset declaration present.' : ''}`
          : 'No viewport meta tag detected. The page may not render correctly on mobile devices.',
        tip: !hasViewport3
          ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to ensure the page scales correctly on all screen sizes.'
          : undefined,
      })
    } catch { /* ignore */ }
  }

  return NextResponse.json({
    url: urlStr,
    finalUrl,
    statusCode,
    responseTimeMs,
    tests,
  } satisfies SiteTestResult)
}
