import Navigation from '@/components/Navigation'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <AdminDashboard />
        </div>
      </main>
    </>
  )
}
