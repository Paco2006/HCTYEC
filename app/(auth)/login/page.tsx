"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Моля, въведете имейл адрес")
      return
    }

    if (!password) {
      setError("Моля, въведете парола")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, we would call an API to authenticate
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll just check if the email contains certain keywords
      let role = "student"
      if (email.includes("admin")) {
        role = "admin"
      } else if (email.includes("company")) {
        role = "company"
      }

      login({
        id: "1",
        name: email.split("@")[0],
        email,
        role,
      })

      toast({
        title: "Успешно влизане",
        description: "Добре дошли обратно!",
      })

      // Redirect based on role and profile completion
      if (role === "company") {
        router.push("/company/profile-setup")
      } else if (role === "student") {
        router.push("/student/profile-setup")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("Невалиден имейл или парола")
    } finally {
      setIsLoading(false)
    }
  }

  // Bypass login for demo purposes
  const handleBypassLogin = (role: "student" | "company" | "admin") => {
    const name = role === "student" ? "Иван Иванов" : role === "company" ? "Acme Inc" : "Admin User"
    const email = `${role}@example.com`

    login({
      id: "1",
      name,
      email,
      role,
      profileCompleted: role === "admin" ? true : false,
    })

    toast({
      title: "Демо режим",
      description: `Влязохте като ${role === "student" ? "ученик" : role === "company" ? "компания" : "администратор"}`,
    })

    // Redirect based on role
    if (role === "student") {
      router.push("/student/profile-setup")
    } else if (role === "company") {
      router.push("/company/profile-setup")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход</CardTitle>
          <CardDescription>Въведете вашите данни за вход</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Имейл</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Парола</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Забравена парола?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Влизане..." : "Вход"}
            </Button>
          </form>

          <div className="mt-4">
            <p className="text-center text-sm text-muted-foreground mb-2">За демо целите на проекта</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => handleBypassLogin("student")}>
                Ученик
              </Button>
              <Button variant="outline" onClick={() => handleBypassLogin("company")}>
                Компания
              </Button>
              <Button variant="outline" onClick={() => handleBypassLogin("admin")}>
                Админ
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Нямате акаунт?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Регистрирайте се
            </Link>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Назад</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
