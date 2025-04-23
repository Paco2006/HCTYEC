import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-6 text-3xl font-bold tracking-tight">Страницата не е намерена</h2>
        <p className="mt-2 text-muted-foreground">Страницата, която търсите, не съществува или е преместена.</p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Към началната страница</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
