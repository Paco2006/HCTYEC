"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCompanies, mockPhases } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

// Check if the choose5 phase is active
const isChoose5PhaseActive = mockPhases.some((phase) => phase.type === "choose5" && phase.isActive)

const formSchema = z.object({
  companies: z
    .array(z.string())
    .min(1, {
      message: "Трябва да изберете поне 1 компания.",
    })
    .max(5, {
      message: "Можете да изберете максимум 5 компании.",
    }),
})

export default function Choose5Page() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companies: [],
    },
  })

  // Watch for changes in the selected companies
  const selectedCompanies = form.watch("companies")

  useEffect(() => {
    setSelectedCount(selectedCompanies.length)
  }, [selectedCompanies])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Избраните компании са запазени",
        description: `Успешно избрахте ${values.companies.length} компании.`,
      })
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при запазването на избраните компании.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  if (!isChoose5PhaseActive) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Фазата не е активна</CardTitle>
            <CardDescription>Фазата за избор на 5 компании все още не е активна или вече е приключила.</CardDescription>
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Избор на 5 компании</h1>
        <p className="text-muted-foreground">Изберете до 5 компании, с които искате да проведете срещи.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Избрани компании: {selectedCount}/5</CardTitle>
          <CardDescription>
            Можете да изберете максимум 5 компании. След като изберете компаниите, ще бъде генериран график за срещи.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="companies"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockCompanies.map((company) => (
                        <FormField
                          key={company.id}
                          control={form.control}
                          name="companies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={company.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(company.id)}
                                    disabled={!field.value?.includes(company.id) && selectedCount >= 5}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, company.id])
                                        : field.onChange(field.value?.filter((value) => value !== company.id))
                                    }}
                                  />
                                </FormControl>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="relative h-8 w-8 rounded overflow-hidden bg-muted">
                                      <Image
                                        src={company.logo || "/placeholder.svg"}
                                        alt={company.name}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium leading-none">{company.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {company.internshipPositions} места
                                      </p>
                                    </div>
                                  </div>
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
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || selectedCount === 0}>
                {isSubmitting ? "Запазване..." : "Запази избраните компании"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
