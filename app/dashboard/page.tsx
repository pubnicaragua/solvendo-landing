"use client"

import { useEffect, useState } from "react"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { Header } from "@/components/layout/header"

export default function DashboardPage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/auth/login"
      return
    }
    setUser(JSON.parse(userData))
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <UserDashboard user={user} />
    </div>
  )
}
