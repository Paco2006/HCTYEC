export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Зареждане...</h2>
        <p className="mt-2 text-muted-foreground">Моля, изчакайте докато зареждаме съдържанието.</p>
      </div>
    </div>
  )
}
