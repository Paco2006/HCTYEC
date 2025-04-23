"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCompanies, mockApplications, mockUsers, mockPhases } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AdminStatisticsPage() {
  const { user } = useAuth()
  const [applicationsByCompany, setApplicationsByCompany] = useState<any[]>([])
  const [applicationsByStatus, setApplicationsByStatus] = useState<any[]>([])
  const [studentsByCompany, setStudentsByCompany] = useState<any[]>([])

  useEffect(() => {
    // Applications by company
    const companyApplications = mockCompanies.map((company) => {
      const applications = mockApplications.filter((app) => app.companyId === company.id)
      return {
        name: company.name,
        applications: applications.length,
      }
    })
    setApplicationsByCompany(companyApplications.sort((a, b) => b.applications - a.applications))

    // Applications by status
    const statusCounts = {
      pending: mockApplications.filter((app) => app.status === "pending").length,
      accepted: mockApplications.filter((app) => app.status === "accepted").length,
      rejected: mockApplications.filter((app) => app.status === "rejected").length,
    }
    setApplicationsByStatus([
      { name: "В изчакване", value: statusCounts.pending, color: "#eab308" },
      { name: "Приети", value: statusCounts.accepted, color: "#22c55e" },
      { name: "Отхвърлени", value: statusCounts.rejected, color: "#ef4444" },
    ])

    // Students by company (accepted applications)
    const acceptedApplications = mockApplications.filter((app) => app.status === "accepted")
    const companyStudents = mockCompanies.map((company) => {
      const students = acceptedApplications.filter((app) => app.companyId === company.id)
      return {
        name: company.name,
        students: students.length,
      }
    })
    setStudentsByCompany(companyStudents.sort((a, b) => b.students - a.students))
  }, [])

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Достъпът е отказан</h2>
          <p className="text-muted-foreground mt-2">Нямате права за достъп до тази страница.</p>
        </div>
      </div>
    )
  }

  // Count statistics
  const totalStudents = mockUsers.filter((u) => u.role === "student").length
  const totalCompanies = mockCompanies.length
  const totalApplications = mockApplications.length
  const activePhase = mockPhases.find((phase) => phase.isActive)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Статистика</h1>
        <p className="text-muted-foreground">Статистически данни за стажантската програма.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Общо ученици</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Общо компании</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Общо кандидатури</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Активна фаза</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePhase ? activePhase.name : "Няма"}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Кандидатури по компании</CardTitle>
            <CardDescription>Брой кандидатури за всяка компания.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationsByCompany}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#2563eb" name="Кандидатури" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статус на кандидатурите</CardTitle>
            <CardDescription>Разпределение на кандидатурите по статус.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicationsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {applicationsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Разпределение на ученици по компании</CardTitle>
            <CardDescription>Брой приети ученици за всяка компания.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentsByCompany}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#22c55e" name="Ученици" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
