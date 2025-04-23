"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/bg"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockMeetings, mockCompanies, mockUsers } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users } from "lucide-react"
import type { Meeting, User } from "@/lib/types"

moment.locale("bg")
const localizer = momentLocalizer(moment)

interface Event {
  id: string
  title: string
  start: Date
  end: Date
  resource: any
}

export default function CompanyMeetingsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    // Find the company associated with the user
    const company = mockCompanies.find((c) => c.users.some((u) => u.id === user.id))
    if (company) {
      setUserCompanyId(company.id)

      // Filter meetings for the company
      const companyMeetings = mockMeetings.filter((meeting) => meeting.companyId === company.id)
      setMeetings(companyMeetings)

      // Convert meetings to calendar events
      const calendarEvents = companyMeetings.map((meeting) => {
        const studentNames = meeting.studentIds
          .map((id) => {
            const student = mockUsers.find((u) => u.id === id)
            return student ? student.name : "Неизвестен ученик"
          })
          .join(", ")

        return {
          id: meeting.id,
          title: `Среща с ${studentNames}`,
          start: new Date(meeting.startTime),
          end: new Date(meeting.endTime),
          resource: meeting,
        }
      })

      setEvents(calendarEvents)
    }
  }, [user])

  if (!user || user.role !== "company") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Достъпът е отказан</h2>
          <p className="text-muted-foreground mt-2">Нямате права за достъп до тази страница.</p>
        </div>
      </div>
    )
  }

  const eventStyleGetter = (event: Event) => {
    const style = {
      backgroundColor: "#2563eb",
      borderRadius: "4px",
      color: "white",
      border: "none",
      display: "block",
    }
    return {
      style,
    }
  }

  // Get student details
  const getStudentDetails = (studentIds: string[]): User[] => {
    return studentIds
      .map((id) => mockUsers.find((u) => u.id === id))
      .filter((student): student is User => student !== undefined)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">График на срещите</h1>
        <p className="text-muted-foreground">Преглед на вашите срещи с ученици.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Календар</CardTitle>
              <CardDescription>Преглед на вашите срещи в календар.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  eventPropGetter={eventStyleGetter}
                  views={["day", "week"]}
                  defaultView="day"
                  defaultDate={events[0]?.start || new Date()}
                  step={10}
                  timeslots={1}
                  formats={{
                    timeGutterFormat: "HH:mm",
                    eventTimeRangeFormat: ({ start, end }) =>
                      `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Предстоящи срещи</CardTitle>
              <CardDescription>Списък на вашите предстоящи срещи.</CardDescription>
            </CardHeader>
            <CardContent>
              {meetings.length === 0 ? (
                <p className="text-center text-muted-foreground">Нямате насрочени срещи.</p>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => {
                    const startTime = new Date(meeting.startTime)
                    const endTime = new Date(meeting.endTime)
                    const isPast = endTime < new Date()
                    const students = getStudentDetails(meeting.studentIds)

                    return (
                      <div key={meeting.id} className={`p-4 border rounded-lg ${isPast ? "opacity-60" : ""}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{students.length} ученици</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {moment(startTime).format("DD MMM, HH:mm")} - {moment(endTime).format("HH:mm")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4" />
                              <span>{meeting.location}</span>
                            </div>
                          </div>
                          <Badge variant={isPast ? "outline" : "default"}>{isPast ? "Приключила" : "Предстояща"}</Badge>
                        </div>
                        <div className="mt-2 text-sm border-t pt-2">
                          <p className="font-medium mb-1">Участници:</p>
                          <ul className="space-y-1">
                            {students.map((student) => (
                              <li key={student.id}>{student.name}</li>
                            ))}
                          </ul>
                        </div>
                        {meeting.notes && (
                          <div className="mt-2 text-sm border-t pt-2">
                            <p className="font-medium mb-1">Бележки:</p>
                            <p>{meeting.notes}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
