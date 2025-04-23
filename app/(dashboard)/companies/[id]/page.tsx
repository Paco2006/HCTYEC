"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ExternalLink, MapPin, Globe, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockCompanies, mockReviews } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Company } from "@/lib/types"

export default function CompanyDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)

  useEffect(() => {
    // Find company by ID
    const foundCompany = mockCompanies.find((c) => c.id === id)
    if (foundCompany) {
      setCompany(foundCompany)
    }
  }, [id])

  if (!company) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Компанията не е намерена</h2>
          <p className="text-muted-foreground mt-2">Компанията, която търсите, не съществува или е премахната.</p>
        </div>
      </div>
    )
  }

  // Get company reviews
  const companyReviews = mockReviews.filter((review) => review.companyId === company.id)

  // Data for pie chart
  const data = [
    { name: "Заети места", value: 1, color: "#2563eb" },
    { name: "Свободни места", value: company.internshipPositions - 1, color: "#e5e7eb" },
  ]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
              <Image src={company.logo || "/placeholder.svg"} alt={company.name} fill className="object-contain p-2" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{company.address}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">За компанията</TabsTrigger>
              <TabsTrigger value="internship">Стаж</TabsTrigger>
              <TabsTrigger value="reviews">Отзиви</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4">
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Описание</h2>
                <p className="text-muted-foreground">{company.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Технологии</h2>
                <div className="flex flex-wrap gap-2">
                  {company.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Контакти</h2>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {company.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                {company.contactPerson && (
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{company.contactPerson}</span>
                  </div>
                )}
                {company.contactEmail && (
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${company.contactEmail}`} className="text-primary hover:underline">
                      {company.contactEmail}
                    </a>
                  </div>
                )}
                {company.contactPhone && (
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{company.contactPhone}</span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="internship" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Описание на стажа</h2>
                <p className="text-muted-foreground">{company.internshipDescription}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Изисквания</h2>
                <p className="text-muted-foreground">{company.internshipRequirements}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Документи</h2>
                <div className="space-y-2">
                  {company.presentationUrl && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={company.presentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Презентация
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {company.planUrl && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a href={company.planUrl} />
                      <a
                        href={company.planUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        План на стажа
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Допълнителна информация</h2>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{company.internshipPositions} места за стажанти</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {company.requiresMotivationLetter
                      ? "Изисква се мотивационно писмо"
                      : "Не се изисква мотивационно писмо"}
                  </span>
                </div>
                {company.internshipType && (
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Вид на стажа:{" "}
                      {company.internshipType === "online"
                        ? "Онлайн"
                        : company.internshipType === "onsite"
                          ? "Присъствено"
                          : "Смесено"}
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {companyReviews.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Няма отзиви</h3>
                  <p className="text-muted-foreground mt-2">Все още няма отзиви за тази компания.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-5 w-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString("bg-BG")}
                            </span>
                          </div>
                        </div>
                        <p className="mt-4">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Места за стаж</CardTitle>
              <CardDescription>Текущо състояние на местата за стаж</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {user?.role === "student" && (
            <div className="space-y-4">
              <Button className="w-full">Добави в избрани</Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/meetings">Виж график на срещи</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
