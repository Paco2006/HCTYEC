"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCompanies, mockPhases } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"
import { FileDropzone } from "@/components/file-dropzone"
import Link from "next/link"

// Check if the top3Choice phase is active
const isTop3PhaseActive = mockPhases.some((phase) => phase.type === "top3Choice" && phase.isActive)

const formSchema = z.object({
  firstChoice: z.string({
    required_error: "Моля, изберете първи избор.",
  }),
  secondChoice: z.string({
    required_error: "Моля, изберете втори избор.",
  }),
  thirdChoice: z.string({
    required_error: "Моля, изберете трети избор.",
  }),
})

export default function Top3Page() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [motivationLetterFile, setMotivationLetterFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstChoice: "",
      secondChoice: "",
      thirdChoice: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // Validate that all choices are different
      const choices = [values.firstChoice, values.secondChoice, values.thirdChoice]
      const uniqueChoices = new Set(choices)
      if (uniqueChoices.size !== 3) {
        toast({
          title: "Грешка",
          description: "Трябва да изберете 3 различни компании.",
          variant: "destructive",
        })
        return
      }

      // Validate that CV is uploaded
      if (!cvFile) {
        toast({
          title: "Грешка",
          description: "Моля, качете вашата автобиография (CV).",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Изборът е запазен",
        description: "Вашият избор на топ 3 компании е запазен успешно.",
      })
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при запазването на вашия избор.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCvUpload = (file: File) => {
    setCvFile(file)
  }

  const handleMotivationLetterUpload = (file: File) => {
    setMotivationLetterFile(file)
  }

  if (!user) return null

  if (!isTop3PhaseActive) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Фазата не е активна</CardTitle>
            <CardDescription>
              Фазата за избор на топ 3 компании все още не е активна или вече е приключила.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard">Обратно към табло</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Get first choice company
  const firstChoiceCompany = form.watch("firstChoice")
    ? mockCompanies.find((c) => c.id === form.watch("firstChoice"))
    : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Избор на топ 3 компании</h1>
        <p className="text-muted-foreground">
          Изберете вашите топ 3 компании по приоритет и качете необходимите документи.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Приоритетен избор</CardTitle>
          <CardDescription>
            Изберете 3 различни компании по приоритет. Кандидатстването ще започне от първия ви избор.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="firstChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Първи избор</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете компания" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCompanies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id}
                              disabled={
                                form.watch("secondChoice") === company.id || form.watch("thirdChoice") === company.id
                              }
                            >
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Вашият приоритетен избор за стаж.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Втори избор</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете компания" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCompanies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id}
                              disabled={
                                form.watch("firstChoice") === company.id || form.watch("thirdChoice") === company.id
                              }
                            >
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Вашият втори избор за стаж.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thirdChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Трети избор</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете компания" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCompanies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id}
                              disabled={
                                form.watch("firstChoice") === company.id || form.watch("secondChoice") === company.id
                              }
                            >
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Вашият трети избор за стаж.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Автобиография (CV)</h3>
                  <FileDropzone
                    onFileUpload={handleCvUpload}
                    acceptedFileTypes={["application/pdf"]}
                    label="Качете вашата автобиография (CV)"
                  />
                </div>

                {firstChoiceCompany && firstChoiceCompany.requiresMotivationLetter && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Мотивационно писмо</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Компанията {firstChoiceCompany.name} изисква мотивационно писмо.
                    </p>
                    <FileDropzone
                      onFileUpload={handleMotivationLetterUpload}
                      acceptedFileTypes={["application/pdf"]}
                      label="Качете вашето мотивационно писмо"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Запазване..." : "Запази избора"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
