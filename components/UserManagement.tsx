'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ChevronUp, ChevronDown, Users } from 'lucide-react'
import { mockUsers, User } from '@/lib/mock-data'

const ROLES = ['all', 'admin', 'developer', 'student'] as const
const STATUSES = ['all', 'active', 'inactive'] as const

export default function UserManagement() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<typeof ROLES[number]>('all')
  const [statusFilter, setStatusFilter] = useState<typeof STATUSES[number]>('all')
  const [sortField, setSortField] = useState<keyof User>('joinDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = useMemo(() => {
    return mockUsers
      .filter(u => {
        const q = search.toLowerCase()
        if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
        if (roleFilter !== 'all' && u.role !== roleFilter) return false
        if (statusFilter !== 'all' && u.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        const va = a[sortField] as string | number
        const vb = b[sortField] as string | number
        const cmp = va < vb ? -1 : va > vb ? 1 : 0
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [search, roleFilter, statusFilter, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const handleSort = (field: keyof User) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ field }: { field: keyof User }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp size={10} className={sortField === field && sortDir === 'asc' ? 'text-[#6366f1]' : 'text-[#334155]'} />
      <ChevronDown size={10} className={sortField === field && sortDir === 'desc' ? 'text-[#6366f1]' : 'text-[#334155]'} />
    </span>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center">
          <Users size={20} className="text-[#6366f1]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">User Management</h1>
          <p className="text-[var(--foreground-muted)] text-sm">{filtered.length} users found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--foreground)] placeholder-[#334155] focus:outline-none focus:border-[#6366f1]"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--foreground-muted)]" />
          <select
            className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[#6366f1]"
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value as typeof ROLES[number]); setPage(1) }}
          >
            {ROLES.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
          <select
            className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[#6366f1]"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as typeof STATUSES[number]); setPage(1) }}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/50">
                {([['name','Name'],['email','Email'],['role','Role'],['experiments','Experiments'],['joinDate','Joined'],['lastActive','Last Active'],['status','Status']] as [keyof User, string][]).map(([field, label]) => (
                  <th key={field} className="text-left px-4 py-3 text-[var(--foreground-muted)] font-medium cursor-pointer hover:text-white select-none" onClick={() => handleSort(field)}>
                    {label}<SortIcon field={field} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--color-border)]/50 hover:bg-[#1e1e2e]/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{user.name}</td>
                  <td className="px-4 py-3 text-[var(--foreground-muted)]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                      : user.role === 'developer' ? 'bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30'
                      : 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground)]">{user.experiments}</td>
                  <td className="px-4 py-3 text-[var(--foreground-muted)]">{user.joinDate}</td>
                  <td className="px-4 py-3 text-[var(--foreground-muted)]">{user.lastActive}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' : 'bg-[#334155]/30 text-[var(--foreground-muted)] border border-[#334155]/30'
                    }`}>{user.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
          <span className="text-sm text-[var(--foreground-muted)]">
            Showing {Math.min((page-1)*perPage+1, filtered.length)}–{Math.min(page*perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page-3), page+2).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-[#6366f1] text-[var(--foreground)]' : 'text-[var(--foreground-muted)] hover:bg-[#1e1e2e] hover:text-white'}`}
              >{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
