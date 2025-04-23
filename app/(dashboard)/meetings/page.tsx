"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { mockCompanies, mockMeetings, mockUsers } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"
import moment from "moment"
import "moment/locale/bg"
import type { Meeting } from "@/lib/types"

moment.locale("bg")

export default function MeetingsPage() {
  const { user } = useAuth()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("")

  // Filter meetings based on selected company and date
  const filteredMeetings = mockMeetings.filter((meeting) => {
    const meetingDate = new Date(meeting.startTime)
    const isDateMatch = date
      ? meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      : true

    const isCompanyMatch = selectedCompany ? meeting.companyId === selectedCompany : true

    // For students, only show their meetings
    if (user?.role === "student") {
      return isDateMatch && isCompanyMatch && meeting.studentIds.includes(user.id)
    }

    // For companies, only show their meetings
    if (user?.role === "company") {
      const userCompany = mockCompanies.find((company) => company.users.some((u) => u.id === user.id))
      return isDateMatch && isCompanyMatch && meeting.companyId === userCompany?.id
    }

    // For admins or not logged in users, show all meetings
    return isDateMatch && isCompanyMatch
  })

  // Sort meetings by time
  const sortedMeetings = [...filteredMeetings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  )

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value)
    const company = mockCompanies.find((c) => c.id === value)
    if (company) {
      setSelectedCompanyName(company.name)
    }
  }

  // Get student details for a meeting
  const getStudentNames = (studentIds: string[]): string => {
    return studentIds
      .map((id) => {
        const student = mockUsers.find((u) => u.id === id)
        return student ? student.name : "Неизвестен ученик"
      })
      .join(", ")
  }

  // Group meetings by time slot for display
  const getMeetingsByTimeSlot = () => {
    const timeSlots: Record<string, Meeting[]> = {}

    sortedMeetings.forEach((meeting) => {
      const timeKey = moment(meeting.startTime).format("HH:mm") + " - " + moment(meeting.endTime).format("HH:mm")
      if (!timeSlots[timeKey]) {
        timeSlots[timeKey] = []
      }
      timeSlots[timeKey].push(meeting)
    })

    return timeSlots
  }

  const meetingsByTimeSlot = getMeetingsByTimeSlot()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">График на срещите</h1>
        <p className="text-muted-foreground">Преглед на графика на срещите между ученици и компании.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Филтри</CardTitle>
            <CardDescription>Изберете дата и компания</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Дата</Label>
              <Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md" />
            </div>
            <div className="space-y-2">
              <Label>Компания</Label>
              <Select value={selectedCompany} onValueChange={handleCompanyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Всички компании">{selectedCompanyName || "Всички компании"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всички компании</SelectItem>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setDate(new Date())
                setSelectedCompany("")
                setSelectedCompanyName("")
              }}
            >
              Изчисти филтри
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {date
                ? date.toLocaleDateString("bg-BG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                : "Всички дати"}
            </CardTitle>
            <CardDescription>
              {selectedCompanyName ? `График за ${selectedCompanyName}` : "График за всички компании"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedMeetings.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Няма намерени срещи за избраните филтри.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(meetingsByTimeSlot).map(([timeSlot, meetings]) => (
                  <div key={timeSlot} className="space-y-3">
                    <h3 className="font-medium text-lg">{timeSlot}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {meetings.map((meeting) => {
                        const company = mockCompanies.find((c) => c.id === meeting.companyId)
                        const studentNames = getStudentNames(meeting.studentIds)
                        const isPast = new Date(meeting.endTime) < new Date()

                        return (
                          <div key={meeting.id} className={`p-4 border rounded-lg ${isPast ? "opacity-60" : ""}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{company?.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{meeting.location}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <Users className="h-4 w-4" />
                                  <span>Участници: {studentNames}</span>
                                </div>
                              </div>
                              <Badge variant={isPast ? "outline" : "default"}>
                                {isPast ? "Приключила" : "Предстояща"}
                              </Badge>
                            </div>
                            {meeting.notes && (
                              <div className="mt-2 text-sm border-t pt-2">
                                <p>{meeting.notes}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
