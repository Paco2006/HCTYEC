"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCompanies } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"
import { FileDropzone } from "@/components/file-dropzone"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const reportFormSchema = z.object({
  companyId: z.string({
    required_error: "Моля, изберете компания.",
  }),
})

const reviewFormSchema = z.object({
  companyId: z.string({
    required_error: "Моля, изберете компания.",
  }),
  rating: z.string({
    required_error: "Моля, изберете оценка.",
  }),
  review: z.string().min(10, {
    message: "Отзивът трябва да бъде поне 10 символа.",
  }),
})

export default function ReportPage() {
  const { user } = useAuth()
  const [isReportSubmitting, setIsReportSubmitting] = useState(false)
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false)
  const [reportFile, setReportFile] = useState<File | null>(null)

  const reportForm = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      companyId: "",
    },
  })

  const reviewForm = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      companyId: "",
      rating: "",
      review: "",
    },
  })

  const onReportSubmit = async (values: z.infer<typeof reportFormSchema>) => {
    // Validate that report is uploaded
    if (!reportFile) {
      toast({
        title: "Грешка",
        description: "Моля, качете вашия финален доклад.",
        variant: "destructive",
      })
      return
    }

    setIsReportSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Докладът е изпратен",
        description: "Вашият финален доклад е изпратен успешно.",
      })

      reportForm.reset()
      setReportFile(null)
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при изпращането на доклада.",
        variant: "destructive",
      })
    } finally {
      setIsReportSubmitting(false)
    }
  }

  const onReviewSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    setIsReviewSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Отзивът е изпратен",
        description: "Вашият отзив за компанията е изпратен успешно.",
      })

      reviewForm.reset()
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при изпращането на отзива.",
        variant: "destructive",
      })
    } finally {
      setIsReviewSubmitting(false)
    }
  }

  const handleReportUpload = (file: File) => {
    setReportFile(file)
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Финален доклад и отзив</h1>
        <p className="text-muted-foreground">Качете вашия финален доклад и оставете отзив за компанията.</p>
      </div>

      <Tabs defaultValue="report" className="space-y-6">
        <TabsList>
          <TabsTrigger value="report">Финален доклад</TabsTrigger>
          <TabsTrigger value="review">Отзив за компанията</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle>Финален доклад</CardTitle>
              <CardDescription>
                Качете вашия финален доклад в PDF формат. Докладът ще бъде видим само от администраторите и от
                компанията, в която сте приети.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...reportForm}>
                <form onSubmit={reportForm.handleSubmit(onReportSubmit)} className="space-y-8">
                  <FormField
                    control={reportForm.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Компания</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Изберете компания" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCompanies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Компанията, в която сте провели стажа.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Финален доклад</h3>
                    <FileDropzone
                      onFileUpload={handleReportUpload}
                      acceptedFileTypes={["application/pdf"]}
                      label="Качете вашия финален доклад (PDF)"
                    />
                  </div>

                  <Button type="submit" disabled={isReportSubmitting}>
                    {isReportSubmitting ? "Изпращане..." : "Изпрати доклад"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Отзив за компанията</CardTitle>
              <CardDescription>
                Оставете отзив за компанията, в която сте провели стажа. Отзивът ще бъде публично видим.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...reviewForm}>
                <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-8">
                  <FormField
                    control={reviewForm.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Компания</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Изберете компания" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCompanies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Компанията, за която искате да оставите отзив.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reviewForm.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Оценка</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Изберете оценка" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 - Отлично</SelectItem>
                            <SelectItem value="4">4 - Много добро</SelectItem>
                            <SelectItem value="3">3 - Добро</SelectItem>
                            <SelectItem value="2">2 - Задоволително</SelectItem>
                            <SelectItem value="1">1 - Лошо</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Вашата оценка за стажа.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reviewForm.control}
                    name="review"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Отзив</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Споделете вашия опит от стажа..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Вашият отзив ще бъде публикуван на страницата на компанията.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isReviewSubmitting}>
                    {isReviewSubmitting ? "Изпращане..." : "Изпрати отзив"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
