'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Code2, LayoutDashboard, Play, Cpu } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const links = [
    { href: '/', label: 'Explorer', icon: Code2 },
    { href: '/playground', label: 'Playground', icon: Play },
    { href: '/admin', label: 'Admin', icon: LayoutDashboard },
  ]
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
              <Cpu size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white"><span className="text-[#6366f1]">YOT</span> Developer</span>
          </motion.div>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href ? 'bg-[#6366f1] text-white' : 'text-[#64748b] hover:text-white hover:bg-[#1e1e2e]'
                }`}
              >
                <Icon size={16} />
                {label}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
