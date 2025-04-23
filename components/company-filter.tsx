"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { mockCompanies } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"

interface CompanyFilterProps {
  onFilterChange: (filters: { search: string; technologies: string[] }) => void
}

export function CompanyFilter({ onFilterChange }: CompanyFilterProps) {
  const [open, setOpen] = useState(false)
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [search, setSearch] = useState("")

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Extract unique technologies from all companies
  const allTechnologies = Array.from(new Set(mockCompanies.flatMap((company) => company.technologies))).sort()

  useEffect(() => {
    // Skip the first render to prevent the initial effect trigger
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Call onFilterChange with current filters
    onFilterChange({ search, technologies: selectedTechnologies })
  }, [search, selectedTechnologies, onFilterChange])

  const toggleTechnology = (technology: string) => {
    setSelectedTechnologies((current) =>
      current.includes(technology) ? current.filter((t) => t !== technology) : [...current, technology],
    )
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder="Търси по име на компания..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between min-w-[200px]">
            {selectedTechnologies.length > 0
              ? `${selectedTechnologies.length} избрани технологии`
              : "Избери технологии"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Търси технология..." />
            <CommandList>
              <CommandEmpty>Няма намерени технологии.</CommandEmpty>
              <CommandGroup>
                {allTechnologies.map((technology) => (
                  <CommandItem key={technology} value={technology} onSelect={() => toggleTechnology(technology)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTechnologies.includes(technology) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {technology}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedTechnologies.length > 0 && (
        <Button variant="ghost" onClick={() => setSelectedTechnologies([])} className="px-2 md:self-end">
          Изчисти филтрите
        </Button>
      )}
    </div>
  )
}
