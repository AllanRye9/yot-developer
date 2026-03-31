import AdminAuth from '@/components/AdminAuth'
import AdminDashboard from '@/components/AdminDashboard'
import Link from 'next/link'
import { ArrowLeft, Cpu } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Admin-only top bar — replaces the global Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b flex-shrink-0"
        style={{
          background: 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          {/* Back arrow */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-md flex items-center justify-center">
              <Cpu size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              <span style={{ color: 'var(--color-accent)' }}>YOT</span> Admin
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
          <AdminAuth>
            <AdminDashboard />
          </AdminAuth>
        </div>
      </main>
    </div>
  )
}
