"use client"

import { useState, useCallback } from "react"
import { CompanyCard } from "@/components/company-card"
import { CompanyFilter } from "@/components/company-filter"
import { mockCompanies } from "@/lib/mock-data"
import type { Company } from "@/lib/types"

export default function CompaniesPage() {
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(mockCompanies)

  // Use useCallback to prevent recreating this function on every render
  const handleFilterChange = useCallback(({ search, technologies }: { search: string; technologies: string[] }) => {
    let filtered = [...mockCompanies]

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Filter by technologies
    if (technologies.length > 0) {
      filtered = filtered.filter((company) => technologies.some((tech) => company.technologies.includes(tech)))
    }

    setFilteredCompanies(filtered)
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Компании</h1>
        <p className="text-muted-foreground">Разгледайте компаниите, участващи в стажантската програма.</p>
      </div>

      <CompanyFilter onFilterChange={handleFilterChange} />

      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Няма намерени компании</h3>
          <p className="text-muted-foreground mt-2">Опитайте с различни филтри или потърсете по-късно.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}
