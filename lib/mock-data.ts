export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'developer' | 'student'
  joinDate: string
  experiments: number
  status: 'active' | 'inactive'
  lastActive: string
}

export interface DailyStat {
  date: string
  activeUsers: number
  experiments: number
  aiQueries: number
}

export interface FeatureUsage {
  feature: string
  count: number
}

export interface ExperienceLevel {
  level: string
  count: number
  color: string
}

const names = [
  'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson',
  'Frank Miller', 'Grace Lee', 'Henry Davis', 'Iris Chen', 'Jack Taylor',
  'Kate Anderson', 'Liam Martin', 'Mia Thompson', 'Noah Garcia', 'Olivia Martinez',
  'Paul Robinson', 'Quinn White', 'Rachel Harris', 'Sam Clark', 'Tina Lewis',
  'Uma Patel', 'Victor Young', 'Wendy King', 'Xavier Scott', 'Yara Green',
  'Zoe Baker', 'Aaron Hill', 'Bella Turner', 'Carlos Adams', 'Diana Evans',
  'Ethan Collins', 'Fiona Edwards', 'George Walker', 'Hannah Hall', 'Ian Allen',
  'Julia Wright', 'Kyle Nelson', 'Laura Carter', 'Mike Mitchell', 'Nina Perez',
  'Oscar Roberts', 'Penny Turner', 'Quincy Phillips', 'Rosa Campbell', 'Steve Parker',
  'Teresa Evans', 'Umar Henderson', 'Violet Coleman', 'Wade Jenkins', 'Xena Morris'
]

export const mockUsers: User[] = names.map((name, i) => ({
  id: `user-${i + 1}`,
  name,
  email: name.toLowerCase().replace(' ', '.') + '@example.com',
  role: i === 0 ? 'admin' : i % 5 === 0 ? 'student' : 'developer',
  joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  experiments: Math.floor(Math.random() * 200),
  status: Math.random() > 0.2 ? 'active' : 'inactive',
  lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}))

export const dailyStats: DailyStat[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    activeUsers: Math.floor(150 + Math.random() * 100 + i * 2),
    experiments: Math.floor(300 + Math.random() * 200 + i * 5),
    aiQueries: Math.floor(80 + Math.random() * 60 + i * 1.5)
  }
})

export const featureUsage: FeatureUsage[] = [
  { feature: 'Console', count: 1240 },
  { feature: 'Network', count: 980 },
  { feature: 'Performance', count: 760 },
  { feature: 'DOM', count: 890 },
  { feature: 'Storage', count: 650 },
  { feature: 'Debugging', count: 720 },
  { feature: 'Workers', count: 420 },
  { feature: 'Security', count: 380 }
]

export const experienceLevels: ExperienceLevel[] = [
  { level: 'Beginner', count: 1250, color: '#10b981' },
  { level: 'Intermediate', count: 1890, color: '#6366f1' },
  { level: 'Advanced', count: 760, color: '#8b5cf6' },
  { level: 'Expert', count: 280, color: '#06b6d4' }
]

export const recentActivity = [
  { user: 'Alice Johnson', action: 'Ran Console API experiment', time: '2 min ago' },
  { user: 'Bob Smith', action: 'Queried AI about Performance', time: '5 min ago' },
  { user: 'Charlie Brown', action: 'Explored Storage API', time: '8 min ago' },
  { user: 'Diana Prince', action: 'Used Playground editor', time: '12 min ago' },
  { user: 'Eve Wilson', action: 'Ran Network fetch experiment', time: '15 min ago' },
  { user: 'Frank Miller', action: 'Queried AI about Workers', time: '18 min ago' },
  { user: 'Grace Lee', action: 'Explored Security features', time: '22 min ago' },
  { user: 'Henry Davis', action: 'Ran DOM manipulation code', time: '25 min ago' },
]

export const adminStats = {
  totalUsers: 4180,
  activeSessions: 342,
  experimentsRun: 28450,
  aiQueries: 9820
}
