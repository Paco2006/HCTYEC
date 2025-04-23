import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Company } from "@/lib/types"

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full bg-muted">
          <Image src={company.logo || "/placeholder.svg"} alt={company.name} fill className="object-contain p-4" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className="font-bold text-xl">{company.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {company.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
            {company.technologies.length > 3 && <Badge variant="outline">+{company.technologies.length - 3}</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">{company.internshipPositions}</span> места
        </div>
        <Button asChild>
          <Link href={`/companies/${company.id}`}>Детайли</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
