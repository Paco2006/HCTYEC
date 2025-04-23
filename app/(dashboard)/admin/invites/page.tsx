"use client"

import { InviteForm } from "@/components/admin/invite-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function AdminInvitesPage() {
  const { user } = useAuth()

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Покани</h1>
        <p className="text-muted-foreground">Изпращане на покани към компании за участие в стажантската програма.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Нова покана</CardTitle>
          <CardDescription>Изпратете покана към компания за участие в стажантската програма.</CardDescription>
        </CardHeader>
        <CardContent>
          <InviteForm />
        </CardContent>
      </Card>
    </div>
  )
}
