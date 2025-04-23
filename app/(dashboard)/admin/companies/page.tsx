"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockCompanies } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Search, MoreHorizontal, ExternalLink } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import type { Company } from "@/lib/types"

export default function AdminCompaniesPage() {
  const { user } = useAuth()
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [searchTerm, setSearchTerm] = useState("")

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Достъпът е отказан</h2>
          <p className="text-muted-foreground mt-2">Нямате права за достъп до тази страница.</p>
        </div>
      </div>
    )
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggleActive = (companyId: string) => {
    // This is a mock implementation - in a real app, this would update the database
    toast({
      title: "Статусът е променен",
      description: "Статусът на компанията беше успешно променен.",
    })
  }

  const handleDelete = (companyId: string) => {
    // This is a mock implementation - in a real app, this would delete from the database
    setCompanies(companies.filter((company) => company.id !== companyId))
    toast({
      title: "Компанията е изтрита",
      description: "Компанията беше успешно изтрита.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Компании</h1>
        <p className="text-muted-foreground">Управление на компаниите в стажантската програма.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Търси по име или описание..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>Добави компания</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Компании</CardTitle>
          <CardDescription>Списък на всички компании в стажантската програма.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Компания</TableHead>
                  <TableHead>Места</TableHead>
                  <TableHead>Технологии</TableHead>
                  <TableHead>Уебсайт</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Няма намерени компании.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={company.logo || "/placeholder.svg"}
                              alt={company.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{company.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {company.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{company.internshipPositions}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {company.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {company.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{company.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {company.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Отвори меню</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/companies/${company.id}`}>Преглед</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(company.id)}>
                              Промени статус
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(company.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              Изтрий
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
