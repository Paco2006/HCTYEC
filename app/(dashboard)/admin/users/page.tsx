"use client"

import { UserTable } from "@/components/admin/user-table"
import { useAuth } from "@/lib/auth-context"

export default function AdminUsersPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Потребители</h1>
        <p className="text-muted-foreground">Управление на потребителите в системата.</p>
      </div>

      <UserTable />
    </div>
  )
}
