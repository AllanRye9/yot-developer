import Navigation from '@/components/Navigation'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Dashboard />
        </div>
      </main>
    </>
  )
}
