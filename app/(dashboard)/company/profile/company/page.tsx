"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"
import { mockCompanies } from "@/lib/mock-data"
import { FileDropzone } from "@/components/file-dropzone"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Company } from "@/lib/types"

const companyFormSchema = z.object({
  name: z.string().min(2, {
    message: "Името трябва да бъде поне 2 символа.",
  }),
  description: z.string().min(10, {
    message: "Описанието трябва да бъде поне 10 символа.",
  }),
  address: z.string().min(5, {
    message: "Адресът трябва да бъде поне 5 символа.",
  }),
  website: z.string().url({
    message: "Моля, въведете валиден URL адрес.",
  }),
  technologies: z.string().min(2, {
    message: "Моля, въведете поне една технология.",
  }),
  internshipDescription: z.string().min(10, {
    message: "Описанието на стажа трябва да бъде поне 10 символа.",
  }),
  internshipPositions: z.coerce.number().min(1, {
    message: "Броят на местата трябва да бъде поне 1.",
  }),
  internshipRequirements: z.string().min(10, {
    message: "Изискванията за стажа трябва да бъдат поне 10 символа.",
  }),
  requiresMotivationLetter: z.boolean().default(false),
})

export default function CompanyProfilePage() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [presentationFile, setPresentationFile] = useState<File | null>(null)
  const [planFile, setPlanFile] = useState<File | null>(null)
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])

  useEffect(() => {
    if (!user) return

    // Find the company associated with the user
    const foundCompany = mockCompanies.find((c) => c.users.some((u) => u.id === user.id))
    if (foundCompany) {
      setCompany(foundCompany)
      setSelectedTechnologies(foundCompany.technologies)
    }
  }, [user])

  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: company
      ? {
          ...company,
          technologies: company.technologies.join(", "),
        }
      : {
          name: "",
          description: "",
          address: "",
          website: "",
          technologies: "",
          internshipDescription: "",
          internshipPositions: 1,
          internshipRequirements: "",
          requiresMotivationLetter: false,
        },
  })

  // Update form when company data is loaded
  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        description: company.description,
        address: company.address,
        website: company.website,
        technologies: company.technologies.join(", "),
        internshipDescription: company.internshipDescription,
        internshipPositions: company.internshipPositions,
        internshipRequirements: company.internshipRequirements,
        requiresMotivationLetter: company.requiresMotivationLetter,
      })
    }
  }, [company, form])

  const onSubmit = async (values: z.infer<typeof companyFormSchema>) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local company state
      if (company) {
        const updatedCompany: Company = {
          ...company,
          name: values.name,
          description: values.description,
          address: values.address,
          website: values.website,
          technologies: values.technologies.split(",").map((tech) => tech.trim()),
          internshipDescription: values.internshipDescription,
          internshipPositions: values.internshipPositions,
          internshipRequirements: values.internshipRequirements,
          requiresMotivationLetter: values.requiresMotivationLetter,
          updatedAt: new Date().toISOString(),
        }
        setCompany(updatedCompany)
        setSelectedTechnologies(updatedCompany.technologies)
      }

      toast({
        title: "Профилът е обновен",
        description: "Профилът на компанията беше успешно обновен.",
      })
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при обновяването на профила.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogoUpload = (file: File) => {
    setLogoFile(file)
  }

  const handlePresentationUpload = (file: File) => {
    setPresentationFile(file)
  }

  const handlePlanUpload = (file: File) => {
    setPlanFile(file)
  }

  if (!user || user.role !== "company") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Достъпът е отказан</h2>
          <p className="text-muted-foreground mt-2">Нямате права за достъп до тази страница.</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Компанията не е намерена</h2>
          <p className="text-muted-foreground mt-2">Не е намерена компания, свързана с вашия профил.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Профил на компанията</h1>
        <p className="text-muted-foreground">Управлявайте профила и информацията за вашата компания.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">
            Обща информация
          </TabsTrigger>
          <TabsTrigger value="internship" className="flex-1">
            Стаж
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1">
            Документи
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Обща информация</CardTitle>
              <CardDescription>Редактирайте общата информация за вашата компания.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="w-full md:w-1/3">
                        <h3 className="text-lg font-medium mb-2">Лого</h3>
                        <div className="relative h-40 w-full bg-muted rounded-lg overflow-hidden mb-2">
                          <Image
                            src={company.logo || "/placeholder.svg"}
                            alt={company.name}
                            fill
                            className="object-contain p-4"
                          />
                        </div>
                        <FileDropzone
                          onFileUpload={handleLogoUpload}
                          acceptedFileTypes={["image/jpeg", "image/png", "image/svg+xml"]}
                          label="Качете лого"
                        />
                      </div>
                      <div className="w-full md:w-2/3 space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Име на компанията</FormLabel>
                              <FormControl>
                                <Input placeholder="Име на компанията" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Описание</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Описание на компанията" className="min-h-[100px]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Адрес</FormLabel>
                            <FormControl>
                              <Input placeholder="Адрес на компанията" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Уебсайт</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="technologies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Технологии</FormLabel>
                          <FormControl>
                            <Input placeholder="JavaScript, React, Node.js" {...field} />
                          </FormControl>
                          <FormDescription>Въведете технологиите, разделени със запетая.</FormDescription>
                          <FormMessage />
                          {selectedTechnologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedTechnologies.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Запазване..." : "Запази промените"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internship">
          <Card>
            <CardHeader>
              <CardTitle>Информация за стажа</CardTitle>
              <CardDescription>Редактирайте информацията за стажантската програма.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="internshipDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание на стажа</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Описание на стажа" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="internshipPositions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Брой места</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>Броят на местата за стажанти.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requiresMotivationLetter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Изисква мотивационно писмо</FormLabel>
                            <FormDescription>
                              Активирайте, ако искате кандидатите да предоставят мотивационно писмо.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="internshipRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Изисквания за стажа</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Изисквания за стажа" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Запазване..." : "Запази промените"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Документи</CardTitle>
              <CardDescription>Качете документи, свързани с вашата стажантска програма.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Презентация</h3>
                <FileDropzone
                  onFileUpload={handlePresentationUpload}
                  acceptedFileTypes={[
                    "application/pdf",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  ]}
                  label="Качете презентация"
                  currentFile={company.presentationUrl}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">План на стажа</h3>
                <FileDropzone
                  onFileUpload={handlePlanUpload}
                  acceptedFileTypes={[
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ]}
                  label="Качете план на стажа"
                  currentFile={company.planUrl}
                />
              </div>

              <Button
                disabled={isSubmitting}
                onClick={() => {
                  toast({
                    title: "Документите са запазени",
                    description: "Вашите документи бяха успешно запазени.",
                  })
                }}
              >
                {isSubmitting ? "Запазване..." : "Запази документите"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
