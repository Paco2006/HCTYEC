export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-96 bg-muted rounded animate-pulse mt-2"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 bg-muted rounded animate-pulse"></div>
        <div className="h-24 bg-muted rounded animate-pulse"></div>
        <div className="h-24 bg-muted rounded animate-pulse"></div>
      </div>

      <div className="h-64 bg-muted rounded animate-pulse"></div>
    </div>
  )
}
