'use client'
import UserAuth from './UserAuth'
import Dashboard from './Dashboard'

export default function DashboardWithAuth() {
  return (
    <UserAuth>
      {() => <Dashboard />}
    </UserAuth>
  )
}
