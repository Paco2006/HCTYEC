"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockFinalReports, mockUsers, mockCompanies } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { FileText, Search, ExternalLink, Check, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { FinalReport } from "@/lib/types"

export default function AdminReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<FinalReport[]>(mockFinalReports)
  const [searchTerm, setSearchTerm] = useState("")

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

  const filteredReports = reports.filter((report) => {
    const student = mockUsers.find((u) => u.id === report.studentId)
    const company = mockCompanies.find((c) => c.id === report.companyId)

    return (
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleApproveFeedback = (reportId: string, feedback: string) => {
    setReports((prevReports) =>
      prevReports.map((report) => (report.id === reportId ? { ...report, feedback } : report)),
    )

    toast({
      title: "Отзивът е запазен",
      description: "Отзивът за доклада беше успешно запазен.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Финални доклади</h1>
        <p className="text-muted-foreground">Преглед и управление на финалните доклади от стажовете.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Търси по име на ученик или компания..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Финални доклади</CardTitle>
          <CardDescription>Списък на всички финални доклади от стажовете.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ученик</TableHead>
                  <TableHead>Компания</TableHead>
                  <TableHead>Доклад</TableHead>
                  <TableHead>Отзив</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Няма намерени доклади.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => {
                    const student = mockUsers.find((u) => u.id === report.studentId)
                    const company = mockCompanies.find((c) => c.id === report.companyId)

                    return (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{student?.name || "Неизвестен"}</TableCell>
                        <TableCell>{company?.name || "Неизвестна"}</TableCell>
                        <TableCell>
                          <a
                            href={report.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            Преглед
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          {report.feedback ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Check className="h-4 w-4" />
                              Има отзив
                            </span>
                          ) : (
                            <span className="text-amber-600 flex items-center gap-1">
                              <X className="h-4 w-4" />
                              Няма отзив
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(report.createdAt).toLocaleDateString("bg-BG")}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const feedback = prompt("Въведете отзив за доклада:", report.feedback || "")
                              if (feedback !== null) {
                                handleApproveFeedback(report.id, feedback)
                              }
                            }}
                          >
                            {report.feedback ? "Редактирай" : "Добави отзив"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
