export interface AdminUser {
  username: string
  passwordHash: string
  role: 'admin' | 'superadmin'
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
  const defaults: AdminUser[] = [
    { username: 'admin', passwordHash: hashPassword('admin123'), role: 'superadmin' },
  ]
  localStorage.setItem('yot-admins', JSON.stringify(defaults))
  return defaults
}

function saveAdminUsers(users: AdminUser[]): void {
  localStorage.setItem('yot-admins', JSON.stringify(users))
}

export function loginAdmin(username: string, password: string): boolean {
  const users = getAdminUsers()
  const hash = hashPassword(password)
  return users.some(u => u.username === username && u.passwordHash === hash)
}

export function registerAdmin(
  username: string,
  password: string
): { success: boolean; error?: string } {
  const users = getAdminUsers()
  if (users.find(u => u.username === username)) {
    return { success: false, error: 'Username already exists' }
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
    role: 'admin',
  }
  saveAdminUsers([...users, newUser])
  return { success: true }
}

export function setAdminSession(username: string): void {
  sessionStorage.setItem('yot-admin-session', username)
}

export function getAdminSession(): string | null {
  return sessionStorage.getItem('yot-admin-session')
}

export function logoutAdmin(): void {
  sessionStorage.removeItem('yot-admin-session')
}
