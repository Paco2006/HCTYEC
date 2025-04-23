"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { mockMessages } from "@/lib/mock-data"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Count unread messages (mock implementation)
  const unreadMessages = user ? mockMessages.filter((m) => m.senderId !== user.id).length : 0

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Отвори меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/dashboard"
                className="text-lg font-medium hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                Начало
              </Link>
              <Link
                href="/companies"
                className="text-lg font-medium hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                Компании
              </Link>
              <Link
                href="/chat"
                className="text-lg font-medium hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                Чат
              </Link>
              <Link
                href="/meetings"
                className="text-lg font-medium hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                График
              </Link>
              <Link
                href="/forms"
                className="text-lg font-medium hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                Бланки
              </Link>
              {user?.role === "student" && (
                <>
                  <Link
                    href="/student/choose-5"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Избор на 5 компании
                  </Link>
                  <Link
                    href="/student/top3"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Топ 3 избор
                  </Link>
                  <Link
                    href="/student/applications"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Моите кандидатури
                  </Link>
                  <Link
                    href="/student/meetings"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Моите срещи
                  </Link>
                  <Link
                    href="/student/report"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Финален доклад
                  </Link>
                </>
              )}
              {user?.role === "company" && (
                <>
                  <Link
                    href="/company/applications"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Кандидатури
                  </Link>
                  <Link
                    href="/company/meetings"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    График срещи
                  </Link>
                </>
              )}
              {user?.role === "admin" && (
                <>
                  <Link
                    href="/admin/users"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Потребители
                  </Link>
                  <Link
                    href="/admin/phases"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Фази
                  </Link>
                  <Link
                    href="/admin/invites"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Покани
                  </Link>
                  <Link
                    href="/admin/meetings"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    График срещи
                  </Link>
                  <Link
                    href="/admin/companies"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Компании
                  </Link>
                  <Link
                    href="/admin/reports"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Доклади
                  </Link>
                  <Link
                    href="/admin/statistics"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Статистика
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 mr-6">
          <span className="font-bold text-xl">NSTUES</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          <Link
            href="/dashboard"
            className={`font-medium ${pathname === "/dashboard" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
          >
            Начало
          </Link>
          <Link
            href="/companies"
            className={`font-medium ${pathname === "/companies" || pathname.startsWith("/companies/") ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
          >
            Компании
          </Link>
          <Link
            href="/chat"
            className={`font-medium ${pathname === "/chat" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
          >
            Чат
          </Link>
          <Link
            href="/meetings"
            className={`font-medium ${pathname === "/meetings" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
          >
            График
          </Link>
          <Link
            href="/forms"
            className={`font-medium ${pathname === "/forms" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
          >
            Бланки
          </Link>
          {user?.role === "student" && (
            <>
              <Link
                href="/student/choose-5"
                className={`font-medium ${pathname === "/student/choose-5" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Избор на 5
              </Link>
              <Link
                href="/student/top3"
                className={`font-medium ${pathname === "/student/top3" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Топ 3
              </Link>
              <Link
                href="/student/applications"
                className={`font-medium ${pathname === "/student/applications" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Кандидатури
              </Link>
            </>
          )}
          {user?.role === "company" && (
            <>
              <Link
                href="/company/applications"
                className={`font-medium ${pathname === "/company/applications" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Кандидатури
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Link
                href="/admin/users"
                className={`font-medium ${pathname === "/admin/users" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Потребители
              </Link>
              <Link
                href="/admin/phases"
                className={`font-medium ${pathname === "/admin/phases" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Фази
              </Link>
              <Link
                href="/admin/invites"
                className={`font-medium ${pathname === "/admin/invites" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Покани
              </Link>
              <Link
                href="/admin/companies"
                className={`font-medium ${pathname === "/admin/companies" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Компании
              </Link>
              <Link
                href="/admin/reports"
                className={`font-medium ${pathname === "/admin/reports" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Доклади
              </Link>
              <Link
                href="/admin/statistics"
                className={`font-medium ${pathname === "/admin/statistics" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
              >
                Статистика
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link href="/chat" className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarFallback>{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "student" && (
                    <DropdownMenuItem asChild>
                      <Link href="/student/profile">Профил</Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "company" && (
                    <DropdownMenuItem asChild>
                      <Link href="/company/profile">Профил</Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Профил</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Изход</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
