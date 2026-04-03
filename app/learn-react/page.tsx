import ReactLearning from '@/components/ReactLearning'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function LearnReactPage() {
  return (
    <main className="pt-12 min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <ReactLearning />
      </div>
    </main>
  )
}
