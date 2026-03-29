import AdminAuth from '@/components/AdminAuth'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  return (
    <main className="pt-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <AdminAuth>
          <AdminDashboard />
        </AdminAuth>
      </div>
    </main>
  )
}
