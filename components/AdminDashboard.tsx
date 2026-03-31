'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts'
import {
  Users, Activity, Brain, TrendingUp, TrendingDown, Globe,
  UserCheck, ShieldCheck, Clock, Database, type LucideIcon,
} from 'lucide-react'
import { dailyStats, featureUsage, experienceLevels, recentActivity, adminStats } from '@/lib/mock-data'
import { getVisitorStats, getRealFeatureUsage, getRecentActivity, getActivityOverTime } from '@/lib/analytics'
import { getUsers } from '@/lib/user-auth'
import { getAdminUsers } from '@/lib/admin-auth'

const BAR_RADIUS_HORIZONTAL = [0, 4, 4, 0] as [number, number, number, number]

const TOOLTIP_STYLE = {
  background: '#12121a',
  border: '1px solid #1e1e2e',
  borderRadius: '8px',
  color: '#e2e8f0',
}

const StatCard = ({
  title, value, change, icon: Icon, color, subtitle,
}: {
  title: string; value: string | number; change: number; icon: LucideIcon; color: string; subtitle?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2, boxShadow: `0 8px 24px ${color}18` }}
    className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 transition-shadow"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
        {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{Math.abs(change)}%
      </div>
    </div>
    <div className="text-2xl font-bold text-[var(--foreground)] mb-0.5">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-xs text-[var(--foreground-muted)]">{title}</div>
    {subtitle && <div className="text-[10px] mt-1" style={{ color }}>{subtitle}</div>}
  </motion.div>
)

const REFRESH_INTERVAL_MS = 10_000

export default function AdminDashboard() {
  const [activeChart, setActiveChart] = useState<'users' | 'experiments' | 'queries'>('users')
  const [visitorStats, setVisitorStats] = useState(getVisitorStats())
  const [realFeatures, setRealFeatures] = useState(getRealFeatureUsage())
  const [realActivity, setRealActivity] = useState(getRecentActivity())
  const [activityOverTime, setActivityOverTime] = useState(getActivityOverTime())
  const [registeredUsers, setRegisteredUsers] = useState(0)
  const [adminUser, setAdminUser] = useState<string>('')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshStats = useCallback(() => {
    setVisitorStats(getVisitorStats())
    setRealFeatures(getRealFeatureUsage())
    setRealActivity(getRecentActivity())
    setActivityOverTime(getActivityOverTime())
    setRegisteredUsers(getUsers().length)
    setLastUpdated(new Date())
  }, [])

  useEffect(() => {
    const admins = getAdminUsers()
    if (admins.length > 0) setAdminUser(admins[0]?.username ?? '')
    refreshStats()
    const interval = setInterval(refreshStats, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refreshStats])

  const chartDataKey = activeChart === 'users' ? 'activeUsers' : activeChart === 'experiments' ? 'experiments' : 'aiQueries'
  const chartColor = activeChart === 'users' ? '#6366f1' : activeChart === 'experiments' ? '#06b6d4' : '#8b5cf6'

  // Use real visits-over-time when data exists, otherwise fall back to mock
  const hasRealActivityData = activityOverTime.some(d => d.visits > 0)
  const activityChartData = hasRealActivityData
    ? activityOverTime
    : dailyStats.map(d => ({ date: d.date, visits: d[chartDataKey] }))

  // Merge real feature data with mock fallback
  const displayedFeatures = realFeatures.length > 0 ? realFeatures : featureUsage

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin Dashboard</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
            Platform analytics &amp; system overview
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
          <Clock size={12} />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          <span className="ml-2 flex items-center gap-1 text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20 rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse inline-block" />
            Live · updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Registered Users"
          value={registeredUsers || adminStats.totalUsers}
          change={12}
          icon={Users}
          color="#6366f1"
          subtitle={registeredUsers > 0 ? `${registeredUsers} real accounts` : 'mock data'}
        />
        <StatCard
          title="Active Sessions"
          value={adminStats.activeSessions}
          change={-3}
          icon={Activity}
          color="#06b6d4"
        />
        <StatCard
          title="Page Visits"
          value={visitorStats.totalVisits || adminStats.experimentsRun}
          change={24}
          icon={Globe}
          color="#10b981"
          subtitle={visitorStats.totalVisits > 0 ? 'live analytics' : undefined}
        />
        <StatCard
          title="AI Queries"
          value={adminStats.aiQueries}
          change={18}
          icon={Brain}
          color="#8b5cf6"
        />
      </div>

      {/* System status row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-9 h-9 bg-[#10b981]/15 border border-[#10b981]/30 rounded-lg flex items-center justify-center shrink-0">
            <UserCheck size={18} className="text-[#10b981]" />
          </div>
          <div>
            <p className="text-xs text-[var(--foreground-muted)]">Admin Account</p>
            <p className="text-sm font-semibold text-[var(--foreground)]">{adminUser || '—'}</p>
            <p className="text-[10px] text-[#10b981] font-medium mt-0.5">Superadmin · Active</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-9 h-9 bg-[#6366f1]/15 border border-[#6366f1]/30 rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-[#6366f1]" />
          </div>
          <div>
            <p className="text-xs text-[var(--foreground-muted)]">Auth Status</p>
            <p className="text-sm font-semibold text-[var(--foreground)]">User sign-in locked</p>
            <p className="text-[10px] text-[#6366f1] font-medium mt-0.5">While admin session is active</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-9 h-9 bg-[#f59e0b]/15 border border-[#f59e0b]/30 rounded-lg flex items-center justify-center shrink-0">
            <Database size={18} className="text-[#f59e0b]" />
          </div>
          <div>
            <p className="text-xs text-[var(--foreground-muted)]">Storage</p>
            <p className="text-sm font-semibold text-[var(--foreground)]">localStorage</p>
            <p className="text-[10px] text-[#f59e0b] font-medium mt-0.5">Demo mode (client-side)</p>
          </div>
        </motion.div>
      </div>

      {/* Visitor Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Globe size={16} className="text-[#6366f1]" />
          Visitor Stats
          {visitorStats.totalVisits > 0 && (
            <span className="text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20 rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider">Live</span>
          )}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
            <p className="text-xs text-[var(--foreground-muted)] mb-1">Total Visits</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">{visitorStats.totalVisits}</p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
            <p className="text-xs text-[var(--foreground-muted)] mb-2">Top Pages</p>
            {visitorStats.topPages.length > 0 ? visitorStats.topPages.slice(0, 3).map(p => (
              <div key={p.path} className="flex justify-between text-xs mb-1">
                <span className="text-[var(--foreground)] truncate max-w-[120px]">{p.path}</span>
                <span className="text-[#6366f1] font-medium">{p.count}</span>
              </div>
            )) : <p className="text-xs text-[var(--foreground-muted)]">No data yet</p>}
          </div>
          <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
            <p className="text-xs text-[var(--foreground-muted)] mb-2">Languages</p>
            {visitorStats.uniqueLanguages.length > 0 ? visitorStats.uniqueLanguages.slice(0, 3).map(l => (
              <div key={l.language} className="flex justify-between text-xs mb-1">
                <span className="text-[var(--foreground)]">{l.language}</span>
                <span className="text-[#06b6d4] font-medium">{l.count}</span>
              </div>
            )) : <p className="text-xs text-[var(--foreground-muted)]">No data yet</p>}
          </div>
        </div>
        {visitorStats.visitsPerDay.length > 0 && (
          <>
            <p className="text-xs text-[var(--foreground-muted)] mb-2">Visits Per Day (last 14 days)</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={visitorStats.visitsPerDay}>
                <defs>
                  <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#visitGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}
      </motion.div>

      {/* Languages / Regions */}
      {visitorStats.uniqueLanguages.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-4">Languages / Regions</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={visitorStats.uniqueLanguages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="language" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#06b6d4" radius={BAR_RADIUS_HORIZONTAL} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Activity Over Time — Area chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
              Activity Over Time
              {hasRealActivityData && (
                <span className="text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20 rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider">Live</span>
              )}
            </h3>
            <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
              {hasRealActivityData ? 'Real page visits · last 30 days' : 'Last 30 days (demo data)'}
            </p>
          </div>
          {!hasRealActivityData && (
            <div className="flex gap-1 bg-[var(--color-bg)] rounded-lg p-1 border border-[var(--color-border)]">
              {(['users', 'experiments', 'queries'] as const).map(t => (
                <button key={t} onClick={() => setActiveChart(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeChart === t ? 'text-white' : 'text-[var(--foreground-muted)] hover:text-white'}`}
                  style={activeChart === t ? { background: chartColor } : {}}
                >
                  {t === 'users' ? 'Users' : t === 'experiments' ? 'Experiments' : 'AI Queries'}
                </button>
              ))}
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={activityChartData}>
            <defs>
              <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: chartColor }} />
            <Area type="monotone" dataKey="visits" stroke={chartColor} fill="url(#actGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Usage */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[var(--foreground)]">Feature Usage</h3>
            {realFeatures.length > 0 && (
              <span className="text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20 rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider">Live session</span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={displayedFeatures} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="feature" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#6366f1" radius={BAR_RADIUS_HORIZONTAL} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Experience Levels */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-6">User Experience Levels</h3>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={experienceLevels} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="count">
                {experienceLevels.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          Recent Activity
          {realActivity.length > 0 && (
            <span className="text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20 rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider">Live</span>
          )}
        </h3>
        <div className="space-y-1">
          {realActivity.length > 0
            ? realActivity.slice(0, 8).map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1]/30 to-[#8b5cf6]/30 border border-[#6366f1]/20 rounded-full flex items-center justify-center text-xs font-bold text-[#a5b4fc]">
                    {activity.path === '/' ? 'H' : activity.path.replace('/', '').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">Page Visit</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{activity.path}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--foreground-muted)] shrink-0">{activity.time}</span>
              </div>
            ))
            : recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1]/30 to-[#8b5cf6]/30 border border-[#6366f1]/20 rounded-full flex items-center justify-center text-xs font-bold text-[#a5b4fc]">
                    {activity.user[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{activity.user}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--foreground-muted)] shrink-0">{activity.time}</span>
              </div>
            ))
          }
        </div>
      </motion.div>
    </div>
  )
}
