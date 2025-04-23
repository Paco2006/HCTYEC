"use client"

import { useAuth } from "@/lib/auth-context"
import { mockCompanies } from "@/lib/mock-data"
import type { Company } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">NSTUES - Стажове за 11. клас в ТУЕС</CardTitle>
          <CardDescription>Платформа за организиране на стажове за ученици от 11. клас в ТУЕС</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {user ? (
              <div className="space-y-6">
                <p className="text-2xl font-bold">Добре дошъл, {user.name}!</p>
                {user.role === "company" && (
                  <div>
                    <h2 className="text-xl font-semibold mt-6 mb-4">Твоите стажове:</h2>
                    {mockCompanies
                      .filter((company: Company) => company.users.some((u) => u.id === user.id))
                      .map((company: Company) => (
                        <div key={company.id} className="mb-4 p-4 border rounded-lg">
                          <h3 className="text-lg font-medium">{company.name}</h3>
                          <p className="mt-2">{company.internshipDescription}</p>
                        </div>
                      ))}
                  </div>
                )}
                <Button asChild className="mt-6">
                  <Link href="/dashboard">Към табло</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xl">Добре дошли в платформата за стажове на ТУЕС</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/login">Вход</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/register">Регистрация</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
