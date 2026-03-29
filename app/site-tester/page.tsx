import SiteTester from '@/components/SiteTester'

export const metadata = {
  title: 'Site Tester | YOT Developer',
  description: 'Test any public URL for security headers, vulnerabilities, and general best practices.',
}

export default function SiteTesterPage() {
  return (
    <main className="pt-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <SiteTester />
      </div>
    </main>
  )
}
