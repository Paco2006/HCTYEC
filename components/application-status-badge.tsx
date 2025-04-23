import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/lib/types"

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          В изчакване
        </Badge>
      )
    case "accepted":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Приета
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Отхвърлена
        </Badge>
      )
    default:
      return <Badge variant="outline">Неизвестен</Badge>
  }
}
