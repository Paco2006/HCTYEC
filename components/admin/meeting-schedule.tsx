"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/bg"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockMeetings, mockCompanies, mockUsers } from "@/lib/mock-data"
import { toast } from "@/components/ui/use-toast"

moment.locale("bg")
const localizer = momentLocalizer(moment)

interface Event {
  id: string
  title: string
  start: Date
  end: Date
  resource: any
}

export function MeetingSchedule() {
  const [events, setEvents] = useState<Event[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Convert mock meetings to calendar events
    const calendarEvents = mockMeetings.map((meeting) => {
      const company = mockCompanies.find((c) => c.id === meeting.companyId)
      const students = meeting.studentIds
        .map((id) => mockUsers.find((u) => u.id === id)?.name || "")
        .filter(Boolean)
        .join(", ")

      return {
        id: meeting.id,
        title: `${company?.name || "Компания"} - ${students}`,
        start: new Date(meeting.startTime),
        end: new Date(meeting.endTime),
        resource: meeting,
      }
    })

    setEvents(calendarEvents)
  }, [])

  const handleGenerateSchedule = async () => {
    setIsGenerating(true)
    try {
      // Simulate API call to generate schedule
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Графикът е генериран",
        description: "Графикът на срещите беше успешно генериран.",
      })
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при генерирането на графика.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>График на срещите</CardTitle>
          <CardDescription>Преглед и управление на графика на срещите между ученици и компании</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={handleGenerateSchedule} disabled={isGenerating}>
              {isGenerating ? "Генериране..." : "Генерирай график"}
            </Button>
          </div>
          <div className="h-[600px]">
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
  )
}
