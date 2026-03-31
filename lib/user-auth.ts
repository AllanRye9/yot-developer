export interface AppUser {
  username: string
  displayName: string
  passwordHash: string
  createdAt: string
}

// NOTE: This is a demo-only hash — not suitable for production.
function hashPassword(p: string): string {
  return btoa(p + 'yot-user-salt')
}

export function getUsers(): AppUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('yot-users')
    if (raw) {
      const parsed = JSON.parse(raw) as AppUser[]
      if (parsed.length > 0) return parsed
    }
  } catch {
    // ignore parse errors
  }
  return []
}

function saveUsers(users: AppUser[]): void {
  localStorage.setItem('yot-users', JSON.stringify(users))
}

export function loginUser(username: string, password: string): boolean {
  const users = getUsers()
  const hash = hashPassword(password)
  return users.some(u => u.username === username && u.passwordHash === hash)
}

export function registerUser(
  username: string,
  displayName: string,
  password: string
): { success: boolean; error?: string } {
  const users = getUsers()
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'Username already exists' }
  }
  if (username.trim().length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' }
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }
  if (displayName.trim().length < 1) {
    return { success: false, error: 'Display name is required' }
  }
  const newUser: AppUser = {
    username: username.trim(),
    displayName: displayName.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, newUser])
  return { success: true }
}

export function setUserSession(username: string): void {
  sessionStorage.setItem('yot-user-session', username)
}

export function getUserSession(): string | null {
  return sessionStorage.getItem('yot-user-session')
}

export function logoutUser(): void {
  sessionStorage.removeItem('yot-user-session')
}

export function getUserByUsername(username: string): AppUser | undefined {
  return getUsers().find(u => u.username === username)
}

/** Returns true when a regular-user session is currently active. */
export function isUserSessionActive(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(sessionStorage.getItem('yot-user-session'))
}
