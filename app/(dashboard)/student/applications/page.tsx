"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockApplications, mockCompanies } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { FileText, ExternalLink } from "lucide-react"
import Image from "next/image"
import type { Application, Company } from "@/lib/types"

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    if (!user) return

    // Filter applications for the current student
    const studentApplications = mockApplications.filter((app) => app.studentId === user.id)
    setApplications(studentApplications)
  }, [user])

  if (!user) return null

  // Group applications by status
  const pendingApplications = applications.filter((app) => app.status === "pending")
  const acceptedApplications = applications.filter((app) => app.status === "accepted")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")

  // Get company details for an application
  const getCompany = (companyId: string): Company | undefined => {
    return mockCompanies.find((company) => company.id === companyId)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Моите кандидатури</h1>
        <p className="text-muted-foreground">Преглед на статуса на вашите кандидатури за стаж.</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Всички ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">В изчакване ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="accepted">Приети ({acceptedApplications.length})</TabsTrigger>
          <TabsTrigger value="rejected">Отхвърлени ({rejectedApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Нямате кандидатури.</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => {
              const company = getCompany(application.companyId)
              return <ApplicationCard key={application.id} application={application} company={company} />
            })
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Нямате кандидатури в изчакване.</p>
              </CardContent>
            </Card>
          ) : (
            pendingApplications.map((application) => {
              const company = getCompany(application.companyId)
              return <ApplicationCard key={application.id} application={application} company={company} />
            })
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Нямате приети кандидатури.</p>
              </CardContent>
            </Card>
          ) : (
            acceptedApplications.map((application) => {
              const company = getCompany(application.companyId)
              return <ApplicationCard key={application.id} application={application} company={company} />
            })
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Нямате отхвърлени кандидатури.</p>
              </CardContent>
            </Card>
          ) : (
            rejectedApplications.map((application) => {
              const company = getCompany(application.companyId)
              return <ApplicationCard key={application.id} application={application} company={company} />
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ApplicationCardProps {
  application: Application
  company?: Company
}

function ApplicationCard({ application, company }: ApplicationCardProps) {
  if (!company) return null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted">
            <Image src={company.logo || "/placeholder.svg"} alt={company.name} fill className="object-contain p-2" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{company.name}</h3>
                <p className="text-sm text-muted-foreground">Приоритет: {application.priority}</p>
              </div>
              <ApplicationStatusBadge status={application.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {application.cvUrl && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={application.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Автобиография
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {application.motivationLetterUrl && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={application.motivationLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Мотивационно писмо
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
