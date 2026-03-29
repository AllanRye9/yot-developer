import DashboardWithAuth from '@/components/DashboardWithAuth'

export default function DashboardPage() {
  return (
    <main className="pt-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <DashboardWithAuth />
      </div>
    </main>
  )
}
