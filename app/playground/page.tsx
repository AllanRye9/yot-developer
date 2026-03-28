import Navigation from '@/components/Navigation'
import Playground from '@/components/Playground'

export default function PlaygroundPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Playground />
        </div>
      </main>
    </>
  )
}
