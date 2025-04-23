"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  Users,
  Calendar,
  Mail,
  MessageSquare,
  FileText,
  Building2,
  ClipboardList,
  Home,
  FileSpreadsheet,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const adminLinks = [
    { href: "/admin/users", label: "Потребители", icon: Users },
    { href: "/admin/phases", label: "Фази", icon: Calendar },
    { href: "/admin/invites", label: "Покани", icon: Mail },
    { href: "/admin/meetings", label: "График срещи", icon: Calendar },
    { href: "/admin/companies", label: "Компании информация", icon: Building2 },
    { href: "/admin/reports", label: "Доклади", icon: FileText },
    { href: "/admin/statistics", label: "Статистика", icon: FileSpreadsheet },
  ]

  const studentLinks = [
    { href: "/student/choose-5", label: "Избор на 5 компании", icon: Building2 },
    { href: "/student/top3", label: "Топ 3 избор", icon: ClipboardList },
    { href: "/student/applications", label: "Моите кандидатури", icon: FileText },
    { href: "/student/meetings", label: "Моите срещи", icon: Calendar },
    { href: "/student/report", label: "Финален доклад", icon: FileSpreadsheet },
  ]

  const companyLinks = [
    { href: "/company/applications", label: "Кандидатури", icon: ClipboardList },
    { href: "/company/meetings", label: "График срещи", icon: Calendar },
  ]

  const commonLinks = [
    { href: "/dashboard", label: "Начало", icon: Home },
    { href: "/companies", label: "Компании информация", icon: Building2 },
    { href: "/chat", label: "Чат", icon: MessageSquare },
    { href: "/meetings", label: "График", icon: Calendar },
    { href: "/forms", label: "Бланки", icon: FileText },
  ]

  const links = [
    ...commonLinks,
    ...(user.role === "admin" ? adminLinks : []),
    ...(user.role === "student" ? studentLinks : []),
    ...(user.role === "company" ? companyLinks : []),
  ]

  return (
    <div className={cn("pb-12 w-64 border-r min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Навигация</h2>
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  pathname === link.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
