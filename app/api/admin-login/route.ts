import { NextRequest, NextResponse } from 'next/server'

// Admin credentials are stored in SERVER-ONLY environment variables (no NEXT_PUBLIC_ prefix).
// Set ADMIN_USER and ADMIN_PASS in your .env.local or hosting dashboard (never exposed to the browser).
const ADMIN_USER = process.env.ADMIN_USER ?? ''
const ADMIN_PASS = process.env.ADMIN_PASS ?? ''

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json() as { username: string; password: string }

    if (!ADMIN_USER || !ADMIN_PASS) {
      return NextResponse.json({ ok: false, error: 'Admin credentials not configured' }, { status: 503 })
    }

    const usernameMatch = username?.trim() === ADMIN_USER
    const passwordMatch = password === ADMIN_PASS

    if (usernameMatch && passwordMatch) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ ok: false, error: 'Invalid username or password' }, { status: 401 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
  }
}
