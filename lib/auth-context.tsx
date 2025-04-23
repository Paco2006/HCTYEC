"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "student" | "company" | "admin"
  phone?: string
  classSection?: string
  github?: string
  linkedin?: string
  technologies?: string[]
  profilePicture?: string
  profileCompleted?: boolean
  // Company specific fields
  companyName?: string
  companyLogo?: string
  companyDescription?: string
  companyWebsite?: string
  companyAddress?: string
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
  internshipType?: "online" | "onsite" | "hybrid"
  positions?: string
  requiresCV?: boolean
  requiresMotivationLetter?: boolean
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateUserProfile: (data: Partial<User>) => void
  updateEmployeeProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    // Don't use window.location.href for redirects in Next.js
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  // Add a function to handle the company employee profile setup
  const updateEmployeeProfile = (employeeData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...employeeData }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const contextValue = {
    user,
    login,
    logout,
    updateUserProfile,
    updateEmployeeProfile, // Add this
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
