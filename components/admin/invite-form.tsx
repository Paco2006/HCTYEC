"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Моля, въведете валиден имейл адрес.",
  }),
  companyName: z.string().min(2, {
    message: "Името на компанията трябва да бъде поне 2 символа.",
  }),
})

export function InviteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      companyName: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Поканата е изпратена",
        description: `Поканата беше изпратена успешно на ${values.email}.`,
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при изпращането на поканата.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имейл адрес</FormLabel>
              <FormControl>
                <Input placeholder="company@example.com" {...field} />
              </FormControl>
              <FormDescription>Имейл адресът на представителя на компанията.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име на компанията</FormLabel>
              <FormControl>
                <Input placeholder="Име на компанията" {...field} />
              </FormControl>
              <FormDescription>Официалното име на компанията.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Изпращане..." : "Изпрати покана"}
        </Button>
      </form>
    </Form>
  )
}
