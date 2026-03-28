import Navigation from '@/components/Navigation'
import DevToolsExplorer from '@/components/DevToolsExplorer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <DevToolsExplorer />
        </div>
      </main>
    </>
  )
}
