"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    // Redirect to profile setup if first login
    if (!loading && user) {
      // For students
      if (user.role === "student" && !user.profileCompleted && pathname !== "/student/profile-setup") {
        router.push("/student/profile-setup")
        return
      }

      // For companies - first employee profile, then company profile
      if (user.role === "company" && !user.profileCompleted) {
        if (pathname !== "/company/employee-profile-setup" && pathname !== "/company/profile-setup") {
          router.push("/company/employee-profile-setup")
          return
        }
      }
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check role-based access for admin pages
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    router.push("/dashboard")
    return null
  }

  // Check role-based access for company pages
  if (pathname.startsWith("/company") && user.role !== "company" && !pathname.startsWith("/company/profile-setup")) {
    router.push("/dashboard")
    return null
  }

  // Check role-based access for student pages
  if (pathname.startsWith("/student") && user.role !== "student" && !pathname.startsWith("/student/profile-setup")) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
