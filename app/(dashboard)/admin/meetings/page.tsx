"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { mockCompanies } from "@/lib/mock-data"

export default function AdminMeetingsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("")

  // Mock meeting slots
  const timeSlots = [
    { time: "09:00 - 09:30", available: true },
    { time: "09:30 - 10:00", available: false, student: "Иван Иванов" },
    { time: "10:00 - 10:30", available: true },
    { time: "10:30 - 11:00", available: false, student: "Мария Петрова" },
    { time: "11:00 - 11:30", available: true },
    { time: "11:30 - 12:00", available: false, student: "Георги Димитров" },
    { time: "13:00 - 13:30", available: true },
    { time: "13:30 - 14:00", available: true },
    { time: "14:00 - 14:30", available: false, student: "Петър Стоянов" },
    { time: "14:30 - 15:00", available: true },
    { time: "15:00 - 15:30", available: true },
    { time: "15:30 - 16:00", available: false, student: "Стефан Николов" },
  ]

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value)
    const company = mockCompanies.find((c) => c.id === value)
    if (company) {
      setSelectedCompanyName(company.name)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">График на срещите</h1>
        <p className="text-muted-foreground">Управлявайте графика на срещите между ученици и компании.</p>
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
                  <SelectValue placeholder="Изберете компания">
                    {selectedCompanyName || "Изберете компания"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Приложи филтри</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {date
                ? date.toLocaleDateString("bg-BG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                : "Изберете дата"}
            </CardTitle>
            <CardDescription>
              {selectedCompanyName ? `График за ${selectedCompanyName}` : "Изберете компания, за да видите графика"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCompany ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className={`p-4 rounded-md border ${slot.available ? "bg-white" : "bg-muted"}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{slot.time}</span>
                        {slot.available ? (
                          <span className="text-sm text-green-600">Свободен</span>
                        ) : (
                          <span className="text-sm text-red-600">Зает</span>
                        )}
                      </div>
                      {!slot.available && slot.student && (
                        <div className="mt-2 text-sm text-muted-foreground">Ученик: {slot.student}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Моля, изберете компания, за да видите графика на срещите.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
