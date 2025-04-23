"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { mockPhases } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"

export function PhaseWizard() {
  const { user } = useAuth()
  const [activePhaseIndex, setActivePhaseIndex] = useState<number | null>(null)

  useEffect(() => {
    // Find the active phase
    const index = mockPhases.findIndex((phase) => phase.isActive)
    setActivePhaseIndex(index !== -1 ? index : null)
  }, [])

  if (!user) return null

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Процес на стажантската програма</CardTitle>
          <CardDescription>Текущ статус и следващи стъпки</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {mockPhases.map((phase, index) => {
              const isActive = index === activePhaseIndex
              const isPast = activePhaseIndex !== null && index < activePhaseIndex
              const isFuture = activePhaseIndex !== null && index > activePhaseIndex

              let actionButton = null
              if (isActive) {
                if (user.role === "student") {
                  if (phase.type === "choose5") {
                    actionButton = (
                      <Button asChild>
                        <Link href="/student/choose-5">
                          Избери компании
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )
                  } else if (phase.type === "top3Choice") {
                    actionButton = (
                      <Button asChild>
                        <Link href="/student/top3">
                          Избери топ 3
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )
                  }
                } else if (user.role === "company" && phase.type.startsWith("round")) {
                  actionButton = (
                    <Button asChild>
                      <Link href="/company/applications">
                        Преглед на кандидатури
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )
                } else if (user.role === "admin") {
                  actionButton = (
                    <Button asChild>
                      <Link href="/admin/phases">
                        Управление на фази
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )
                }
              }

              return (
                <div key={phase.id} className="flex items-start gap-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isPast
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "bg-accent text-accent-foreground border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isPast ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{phase.name}</p>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                        </span>
                      </div>
                    </div>
                    {isActive && actionButton && <div className="mt-2">{actionButton}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
