"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockPhases } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { PhaseForm } from "@/components/admin/phase-form"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { Calendar, CheckCircle, XCircle, Plus } from "lucide-react"
import type { Phase } from "@/lib/types"

export default function AdminPhasesPage() {
  const { user } = useAuth()
  const [phases, setPhases] = useState<Phase[]>(mockPhases)
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState("list")

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

  const handleCreatePhase = async (data: any) => {
    // Create new phase
    const newPhase: Phase = {
      id: `${phases.length + 1}`,
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setPhases([...phases, newPhase])
    setIsCreating(false)
    setActiveTab("list")
    toast({
      title: "Фазата е създадена",
      description: "Новата фаза беше успешно създадена.",
    })
  }

  const handleUpdatePhase = async (data: any) => {
    if (!selectedPhase) return

    // Update phase
    const updatedPhases = phases.map((phase) =>
      phase.id === selectedPhase.id
        ? {
            ...phase,
            ...data,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : phase,
    )

    setPhases(updatedPhases)
    setSelectedPhase(null)
    toast({
      title: "Фазата е обновена",
      description: "Фазата беше успешно обновена.",
    })
  }

  const handleToggleActive = (phaseId: string) => {
    // Toggle active state
    const updatedPhases = phases.map((phase) =>
      phase.id === phaseId ? { ...phase, isActive: !phase.isActive, updatedAt: new Date().toISOString() } : phase,
    )

    setPhases(updatedPhases)
    toast({
      title: "Статусът е променен",
      description: "Статусът на фазата беше успешно променен.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Фази</h1>
        <p className="text-muted-foreground">Управление на фазите на стажантската програма.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">Списък</TabsTrigger>
            <TabsTrigger value="form">Нова фаза</TabsTrigger>
          </TabsList>
          {activeTab === "list" && (
            <Button
              onClick={() => {
                setIsCreating(true)
                setActiveTab("form")
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добави фаза
            </Button>
          )}
        </div>

        <TabsContent value="list" className="space-y-4">
          {phases.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Няма създадени фази.</p>
              </CardContent>
            </Card>
          ) : (
            phases.map((phase) => (
              <Card key={phase.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">{phase.name}</h3>
                          <p className="text-sm text-muted-foreground">{phase.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {phase.isActive ? (
                                <div className="flex items-center gap-1 text-green-600 text-sm">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Активна</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                  <XCircle className="h-4 w-4" />
                                  <span>Неактивна</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPhase(phase)}>
                            Редактирай
                          </Button>
                          <Button
                            variant={phase.isActive ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleToggleActive(phase.id)}
                          >
                            {phase.isActive ? "Деактивирай" : "Активирай"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Нова фаза</CardTitle>
              <CardDescription>Създайте нова фаза на стажантската програма.</CardDescription>
            </CardHeader>
            <CardContent>
              <PhaseForm onSubmit={handleCreatePhase} />
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setIsCreating(false)
                  setActiveTab("list")
                }}
              >
                Отказ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedPhase && (
        <Card>
          <CardHeader>
            <CardTitle>Редактиране на фаза</CardTitle>
            <CardDescription>Редактирайте детайлите на фазата.</CardDescription>
          </CardHeader>
          <CardContent>
            <PhaseForm initialData={selectedPhase} onSubmit={handleUpdatePhase} />
            <Button variant="outline" className="mt-4" onClick={() => setSelectedPhase(null)}>
              Отказ
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
