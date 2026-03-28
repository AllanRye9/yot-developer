'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, Activity, Brain, TrendingUp, TrendingDown } from 'lucide-react'
import { dailyStats, featureUsage, experienceLevels, recentActivity, adminStats } from '@/lib/mock-data'

const StatCard = ({ title, value, change, icon: Icon, color }: { title: string; value: string | number; change: number; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
        {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{Math.abs(change)}%
      </div>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    <div className="text-sm text-[#64748b]">{title}</div>
  </motion.div>
)

export default function AdminDashboard() {
  const [activeChart, setActiveChart] = useState<'users' | 'experiments' | 'queries'>('users')
  const chartDataKey = activeChart === 'users' ? 'activeUsers' : activeChart === 'experiments' ? 'experiments' : 'aiQueries'
  const chartColor = activeChart === 'users' ? '#6366f1' : activeChart === 'experiments' ? '#06b6d4' : '#8b5cf6'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={adminStats.totalUsers} change={12} icon={Users} color="#6366f1" />
        <StatCard title="Active Sessions" value={adminStats.activeSessions} change={-3} icon={Activity} color="#06b6d4" />
        <StatCard title="Experiments Run" value={adminStats.experimentsRun} change={24} icon={Brain} color="#10b981" />
        <StatCard title="AI Queries" value={adminStats.aiQueries} change={18} icon={Brain} color="#8b5cf6" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Activity Over Time (30 Days)</h3>
          <div className="flex gap-2">
            {(['users', 'experiments', 'queries'] as const).map(t => (
              <button key={t} onClick={() => setActiveChart(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeChart === t ? 'bg-[#6366f1] text-white' : 'text-[#64748b] hover:text-white'}`}>
                {t === 'users' ? 'Users' : t === 'experiments' ? 'Experiments' : 'AI Queries'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: '8px', color: '#e2e8f0' }} itemStyle={{ color: chartColor }} />
            <Line type="monotone" dataKey={chartDataKey} stroke={chartColor} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Feature Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={featureUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="feature" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
              <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: '8px', color: '#e2e8f0' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0] as [number, number, number, number]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">User Experience Levels</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={experienceLevels} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="count">
                {experienceLevels.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: '8px', color: '#e2e8f0' }} />
              <Legend formatter={(value) => <span style={{ color: '#64748b', fontSize: '12px' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#1e1e2e] last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1e1e2e] rounded-full flex items-center justify-center text-xs font-bold text-[#6366f1]">{activity.user[0]}</div>
                <div><p className="text-sm font-medium text-[#e2e8f0]">{activity.user}</p><p className="text-xs text-[#64748b]">{activity.action}</p></div>
              </div>
              <span className="text-xs text-[#64748b]">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
