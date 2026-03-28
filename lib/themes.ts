export interface Theme {
  id: string
  name: string
  bg: string
  card: string
  border: string
  accent: string
  accentLight: string
  swatchColor: string
}

export const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    bg: '#0a0a0f',
    card: '#12121a',
    border: '#1e1e2e',
    accent: '#6366f1',
    accentLight: '#8b5cf6',
    swatchColor: '#6366f1',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    bg: '#0d0d1a',
    card: '#111120',
    border: '#1a1a30',
    accent: '#00ffff',
    accentLight: '#00e5e5',
    swatchColor: '#00ffff',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    bg: '#040d1a',
    card: '#071424',
    border: '#0e2040',
    accent: '#0ea5e9',
    accentLight: '#38bdf8',
    swatchColor: '#0ea5e9',
  },
  {
    id: 'forest',
    name: 'Forest',
    bg: '#040d08',
    card: '#071410',
    border: '#0e2018',
    accent: '#10b981',
    accentLight: '#34d399',
    swatchColor: '#10b981',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bg: '#1a0a08',
    card: '#220e0a',
    border: '#3a1810',
    accent: '#f97316',
    accentLight: '#fb923c',
    swatchColor: '#f97316',
  },
]

export const defaultTheme = themes[0]

export function getThemeCSSVars(theme: Theme): Record<string, string> {
  return {
    '--color-bg': theme.bg,
    '--color-card': theme.card,
    '--color-border': theme.border,
    '--color-accent': theme.accent,
    '--color-accent-light': theme.accentLight,
  }
}

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) ?? defaultTheme
}
