export interface AdminUser {
  username: string
  passwordHash: string
  role: 'admin' | 'superadmin'
  createdAt: string
}

export function hashPassword(p: string): string {
  // NOTE: This is a demo-only hash — not suitable for production.
  // Use bcrypt/argon2 in a real application.
  return btoa(p + 'yot-salt')
}

export function getAdminUsers(): AdminUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('yot-admins')
    if (raw) {
      const parsed = JSON.parse(raw) as AdminUser[]
      if (parsed.length > 0) return parsed
    }
  } catch {
    // ignore parse errors
  }
  return []
}

/** Returns true if at least one admin account has been registered. */
export function hasAdmin(): boolean {
  return getAdminUsers().length > 0
}

function saveAdminUsers(users: AdminUser[]): void {
  localStorage.setItem('yot-admins', JSON.stringify(users))
}

export function loginAdmin(username: string, password: string): boolean {
  const users = getAdminUsers()
  const hash = hashPassword(password)
  return users.some(u => u.username === username && u.passwordHash === hash)
}

/**
 * Register the very first admin account.
 * Subsequent calls are rejected — there can only be one admin.
 */
export function registerAdmin(
  username: string,
  password: string
): { success: boolean; error?: string } {
  // Only the first registrant may become admin.
  if (hasAdmin()) {
    return { success: false, error: 'An admin account already exists. Only one admin is allowed.' }
  }
  if (username.trim().length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' }
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }
  const newUser: AdminUser = {
    username: username.trim(),
    passwordHash: hashPassword(password),
    role: 'superadmin',
    createdAt: new Date().toISOString(),
  }
  saveAdminUsers([newUser])
  return { success: true }
}

export function setAdminSession(username: string): void {
  sessionStorage.setItem('yot-admin-session', username)
}

export function getAdminSession(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('yot-admin-session')
}

export function logoutAdmin(): void {
  sessionStorage.removeItem('yot-admin-session')
}

/** Returns true when an admin is currently logged in (active session). */
export function isAdminSessionActive(): boolean {
  return Boolean(getAdminSession())
}
