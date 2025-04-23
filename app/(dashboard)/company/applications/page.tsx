"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { Button } from "@/components/ui/button"
import { mockApplications, mockUsers, mockCompanies } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Download, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function CompanyApplicationsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)

  if (!user) return null

  // Find the company associated with the current user
  const company = mockCompanies.find((c) => c.users.some((u) => u.id === user.id))

  if (!company) return <div>Компанията не е намерена</div>

  // Get applications for this company
  const applications = mockApplications.filter((app) => app.companyId === company.id)

  // Filter applications based on active tab
  const filteredApplications =
    activeTab === "all" ? applications : applications.filter((app) => app.status === activeTab)

  // Get student details for an application
  const getStudent = (studentId: string) => {
    return mockUsers.find((user) => user.id === studentId)
  }

  // Handle application status change
  const handleStatusChange = (applicationId: string, newStatus: "accepted" | "rejected") => {
    // In a real app, this would update the database
    console.log(`Application ${applicationId} status changed to ${newStatus}`)

    // Close the dialog
    setSelectedApplication(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Кандидатури</h1>
        <p className="text-muted-foreground">Управление на кандидатурите за стаж във вашата компания.</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Всички
            <Badge variant="secondary" className="ml-2">
              {applications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Чакащи
            <Badge variant="secondary" className="ml-2">
              {applications.filter((app) => app.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Одобрени
            <Badge variant="secondary" className="ml-2">
              {applications.filter((app) => app.status === "accepted").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Отхвърлени
            <Badge variant="secondary" className="ml-2">
              {applications.filter((app) => app.status === "rejected").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Няма намерени кандидатури.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((application) => {
                const student = getStudent(application.studentId)

                return (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student?.profilePicture || "/placeholder.svg"} alt={student?.name} />
                            <AvatarFallback>{student?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{student?.name}</h3>
                            <p className="text-sm text-muted-foreground">{student?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <ApplicationStatusBadge status={application.status} />
                              {application.priority && (
                                <Badge variant="outline">Приоритет: {application.priority}</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApplication(application.id)}
                              >
                                Преглед
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Детайли за кандидатурата</DialogTitle>
                                <DialogDescription>
                                  Преглед на документите и информацията за кандидата.
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="md:col-span-1">
                                  <div className="flex flex-col items-center">
                                    <Avatar className="h-24 w-24">
                                      <AvatarImage
                                        src={student?.profilePicture || "/placeholder.svg"}
                                        alt={student?.name}
                                      />
                                      <AvatarFallback>{student?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-medium mt-2">{student?.name}</h3>
                                    <p className="text-sm text-muted-foreground">{student?.email}</p>
                                    <p className="text-sm text-muted-foreground">Клас: 11 {student?.classSection}</p>

                                    <div className="mt-4 w-full">
                                      <h4 className="text-sm font-medium mb-2">Технологии</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {student?.technologies?.map((tech) => (
                                          <Badge key={tech} variant="secondary" className="text-xs">
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    {student?.github && (
                                      <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                                        <a href={student.github} target="_blank" rel="noopener noreferrer">
                                          GitHub профил
                                        </a>
                                      </Button>
                                    )}

                                    {student?.linkedin && (
                                      <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                                        <a href={student.linkedin} target="_blank" rel="noopener noreferrer">
                                          LinkedIn профил
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                <div className="md:col-span-2">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium">Документи</h4>
                                      <Separator className="my-2" />

                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 border rounded-md">
                                          <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <span>Автобиография (CV)</span>
                                          </div>
                                          <Button variant="ghost" size="sm" asChild>
                                            <a href={application.cvUrl} target="_blank" rel="noopener noreferrer">
                                              <Download className="h-4 w-4 mr-1" />
                                              Изтегли
                                            </a>
                                          </Button>
                                        </div>

                                        {application.motivationLetterUrl && (
                                          <div className="flex items-center justify-between p-2 border rounded-md">
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-5 w-5 text-primary" />
                                              <span>Мотивационно писмо</span>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                              <a
                                                href={application.motivationLetterUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <Download className="h-4 w-4 mr-1" />
                                                Изтегли
                                              </a>
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-medium">Статус на кандидатурата</h4>
                                      <Separator className="my-2" />

                                      <div className="flex items-center gap-2 mb-4">
                                        <ApplicationStatusBadge status={application.status} />
                                        <span className="text-sm text-muted-foreground">
                                          Кандидатурата е подадена на{" "}
                                          {new Date(application.createdAt).toLocaleDateString("bg-BG")}
                                        </span>
                                      </div>

                                      {application.status === "pending" && (
                                        <div className="flex gap-2">
                                          <Button
                                            variant="default"
                                            className="flex-1"
                                            onClick={() => handleStatusChange(application.id, "accepted")}
                                          >
                                            <Check className="h-4 w-4 mr-2" />
                                            Одобри
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => handleStatusChange(application.id, "rejected")}
                                          >
                                            <X className="h-4 w-4 mr-2" />
                                            Отхвърли
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
