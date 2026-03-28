import Navigation from '@/components/Navigation'
import Inspector from '@/components/Inspector'

export default function InspectorPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Inspector />
        </div>
      </main>
    </>
  )
}
