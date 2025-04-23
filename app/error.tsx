"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-6xl font-bold text-destructive">Грешка</h1>
        <h2 className="mt-6 text-3xl font-bold tracking-tight">Нещо се обърка</h2>
        <p className="mt-2 text-muted-foreground">Възникна грешка при зареждането на страницата.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={reset}>Опитай отново</Button>
          <Button variant="outline" asChild>
            <Link href="/">Към началната страница</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
