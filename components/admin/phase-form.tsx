"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { bg } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import type { Phase, PhaseType } from "@/lib/types"

const phaseTypes: { value: PhaseType; label: string }[] = [
  { value: "choose5", label: "Избор на 5 компании" },
  { value: "liveMeetings", label: "Провеждане на срещи" },
  { value: "top3Choice", label: "Избор на топ 3 компании" },
  { value: "round1", label: "Първи кръг кандидатстване" },
  { value: "round2", label: "Втори кръг кандидатстване" },
  { value: "round3", label: "Трети кръг кандидатстване" },
]

const formSchema = z.object({
  type: z.enum(["choose5", "liveMeetings", "top3Choice", "round1", "round2", "round3"]),
  name: z.string().min(2, {
    message: "Името трябва да бъде поне 2 символа.",
  }),
  description: z.string().min(10, {
    message: "Описанието трябва да бъде поне 10 символа.",
  }),
  startDate: z.date({
    required_error: "Моля, изберете начална дата.",
  }),
  endDate: z.date({
    required_error: "Моля, изберете крайна дата.",
  }),
  isActive: z.boolean().default(false),
})

interface PhaseFormProps {
  initialData?: Phase
  onSubmit: (data: z.infer<typeof formSchema>) => void
}

export function PhaseForm({ initialData, onSubmit }: PhaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: new Date(initialData.startDate),
          endDate: new Date(initialData.endDate),
        }
      : {
          type: "choose5",
          name: "",
          description: "",
          startDate: new Date(),
          endDate: new Date(),
          isActive: false,
        },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // Validate that end date is after start date
      if (values.endDate < values.startDate) {
        form.setError("endDate", {
          type: "manual",
          message: "Крайната дата трябва да бъде след началната дата.",
        })
        return
      }

      await onSubmit(values)
      toast({
        title: initialData ? "Фазата е обновена" : "Фазата е създадена",
        description: "Промените са запазени успешно.",
      })
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при запазването на фазата.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип на фазата</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Избери тип на фазата" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {phaseTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Типът определя функционалността и последователността на фазата.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Име на фазата</FormLabel>
                <FormControl>
                  <Input placeholder="Въведете име на фазата" {...field} />
                </FormControl>
                <FormDescription>Името ще бъде показано на потребителите.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Въведете описание на фазата" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Подробно описание на целта и действията в тази фаза.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Начална дата</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: bg }) : <span>Изберете дата</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("2023-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Датата, от която започва фазата.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Крайна дата</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: bg }) : <span>Изберете дата</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("2023-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Датата, на която приключва фазата.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Активна фаза</FormLabel>
                <FormDescription>Активирайте фазата, за да я направите видима за потребителите.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Запазване..." : initialData ? "Обнови фаза" : "Създай фаза"}
        </Button>
      </form>
    </Form>
  )
}
