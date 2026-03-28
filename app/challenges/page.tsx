import Navigation from '@/components/Navigation'
import Challenges from '@/components/Challenges'

export default function ChallengesPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Challenges />
        </div>
      </main>
    </>
  )
}
