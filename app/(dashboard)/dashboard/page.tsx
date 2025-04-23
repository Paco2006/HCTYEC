"use client"

import { useAuth } from "@/lib/auth-context"
import { PhaseWizard } from "@/components/phase-wizard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPhases, mockApplications, mockMeetings } from "@/lib/mock-data"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  // Don't render dashboard if profile is not completed
  if (!user.profileCompleted && user.role !== "admin") {
    return null
  }

  // Count active phases
  const activePhases = mockPhases.filter((phase) => phase.isActive).length

  // Count applications based on user role
  const applicationCount =
    user.role === "student"
      ? mockApplications.filter((app) => app.studentId === user.id).length
      : user.role === "company"
        ? mockApplications.filter((app) => app.companyId === "1").length // Assuming company ID 1 for demo
        : mockApplications.length

  // Count meetings based on user role
  const meetingCount =
    user.role === "student"
      ? mockMeetings.filter((meeting) => meeting.studentIds.includes(user.id)).length
      : user.role === "company"
        ? mockMeetings.filter((meeting) => meeting.companyId === "1").length // Assuming company ID 1 for demo
        : mockMeetings.length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Табло</h1>
        <p className="text-muted-foreground">Добре дошли, {user.name}! Ето вашия напредък в стажантската програма.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активни фази</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePhases}</div>
            <p className="text-xs text-muted-foreground">{activePhases === 1 ? "Активна фаза" : "Активни фази"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Кандидатури</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicationCount}</div>
            <p className="text-xs text-muted-foreground">
              {user.role === "student"
                ? "Ваши кандидатури"
                : user.role === "company"
                  ? "Получени кандидатури"
                  : "Общо кандидатури"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Срещи</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingCount}</div>
            <p className="text-xs text-muted-foreground">
              {user.role === "student" ? "Ваши срещи" : user.role === "company" ? "Насрочени срещи" : "Общо срещи"}
            </p>
          </CardContent>
        </Card>
      </div>

      <PhaseWizard />
    </div>
  )
}
